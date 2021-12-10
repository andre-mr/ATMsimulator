const AWS = require('aws-sdk');
let dynamodb = new AWS.DynamoDB.DocumentClient();

const Table = "ATMsimulator";
let date, now, payload, account, response;

exports.handler = async (event) => {


    date = new Date();
    now = date.toISOString();
    const operation = event.Operation;

    switch (operation) {
        case 'Balance':
            account = await validateLogin(event);
            if (account) {
                let message = responseMessages.SuccessBalance;
                message.body.Account = account;
                return message;
            } else {
                return responseMessages.LoginFailed;
            }

        case 'Deposit':
            account = await validateAccount(event);
            if (account && account.Active) {
                payload = formatDeposit(event);
                response = await dynamodb.put(payload).promise();
                if (response) {
                    await updateAccountBalance(event);
                    await updateCounter(event.Value);
                    return responseMessages.SuccessDeposit;
                } else {
                    return responseMessages.OperationFailed;
                }
            } else {
                return responseMessages.InvalidAccount;
            }

        case 'Withdrawal':
            account = await validateLogin(event);
            if (account) {
                if (account.Balance >= event.Value) {
                    payload = formatWithdrawal(event);
                    response = await dynamodb.put(payload).promise();
                    if (response) {
                        let eventNegative = event;
                        eventNegative.Value = -event.Value;
                        await updateAccountBalance(eventNegative);
                        await updateCounter(eventNegative.Value);
                        return responseMessages.SuccessWithdrawal;
                    } else {
                        return responseMessages.OperationFailed;
                    }
                } else {
                    return responseMessages.InsufficientFunds;
                }
            } else {
                return responseMessages.LoginFailed;
            }

        case "Transfer":
            let accountDestiny = {
                "Account": event.Destiny
            }
            let validatedAccount = await validateLogin(event);
            accountDestiny = await validateAccount(accountDestiny);
            if (!accountDestiny || !accountDestiny.Active) {
                return responseMessages.InvalidAccount;
            } else if (!validatedAccount) {
                return responseMessages.LoginFailed;
            } else if (validatedAccount.Balance < event.Value) {
                return responseMessages.InsufficientFunds;
            } else {
                payload = formatTransferDebit(event);
                payload.Item.Name = accountDestiny.Name;
                response = await dynamodb.put(payload).promise();
                if (response) {
                    let updateItem = {
                        "Account": event.Account,
                        "Value": -event.Value
                    }
                    await updateAccountBalance(updateItem);
                    await updateCounter(-parseInt(event.Value));
                    payload = formatTransferCredit(event);
                    payload.Item.Name = validatedAccount.Name;
                    response = await dynamodb.put(payload).promise();
                    if (response) {
                        updateItem = {
                            "Account": event.Destiny,
                            "Value": event.Value
                        }
                        await updateAccountBalance(updateItem);
                        await updateCounter(event.Value);
                        response = responseMessages.SuccessTransfer;
                        response.body.Name = accountDestiny.Name;
                        return response;
                    } else {
                        return responseMessages.OperationFailed;
                    }
                } else {
                    return responseMessages.OperationFailed;
                }
            }

        case "Statement":
            account = await validateLogin(event);
            if (account) {
                payload = formatStatement(event);
                let result = await dynamodb.query(payload).promise();
                if (result.Items.length > 0) {
                    response = responseMessages.SuccessStatement;
                    response.body.Statement = result.Items;
                    return response;
                } else {
                    return responseMessages.OperationFailed;
                }
            } else {
                return responseMessages.LoginFailed;
            }

        default:
            throw new Error(`Unrecognized operation "${operation}"`);
    }
};

const validateLogin = async (e) => {
    let params = {
        TableName: Table,
        KeyConditionExpression: "PK = :PK and SK = :SK",
        ExpressionAttributeValues: {
            ":PK": "PROFILE",
            ":SK": "ACCOUNT#" + e.Account
        }
    };
    let result = await dynamodb.query(params).promise();
    if (result.Items.length > 0) {
        result = result.Items[0];
        if (result.Active && (result.Password == e.Password)) {
            return result;
        } else {
            return null;
        };
    } else {
        return null;
    }
}

const validateAccount = async (e) => {
    let params = {
        TableName: Table,
        KeyConditionExpression: "PK = :PK and SK = :SK",
        ExpressionAttributeValues: {
            ":PK": "PROFILE",
            ":SK": "ACCOUNT#" + e.Account
        }
    };
    let result = await dynamodb.query(params).promise();
    if (result.Items.length > 0) {
        return result.Items[0];
    } else {
        return null;
    }
}

const formatDeposit = (e) => {
    let params = {
        TableName: Table,
        Item: {
            "PK": "TRANSACTION",
            "SK": `ACCOUNT#${e.Account}#${now}`,
            "Type": "Deposit",
            "Value": e.Value
        }
    }
    return params;
}

const formatWithdrawal = (e) => {
    let params = {
        TableName: Table,
        Item: {
            "PK": "TRANSACTION",
            "SK": `ACCOUNT#${e.Account}#${now}`,
            "Type": "Withdrawal",
            "Value": e.Value
        }
    }
    return params;
}

const formatTransferCredit = (e) => {
    let params = {
        TableName: Table,
        Item: {
            "PK": "TRANSACTION",
            "SK": `ACCOUNT#${e.Destiny}#${now}`,
            "Type": "Credit",
            "Value": e.Value,
            "Origin": e.Account
        }
    }
    return params;
}

const formatTransferDebit = (e) => {
    let params = {
        TableName: Table,
        Item: {
            "PK": "TRANSACTION",
            "SK": `ACCOUNT#${e.Account}#${now}`,
            "Type": "Debit",
            "Value": e.Value,
            "Destiny": e.Destiny
        }
    };
    return params;
}

const formatStatement = (e) => {
    let params = {
        TableName: Table,
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        ExpressionAttributeValues: {
            ":PK": "TRANSACTION",
            ":SK": "ACCOUNT#" + e.Account + "#" + e.Period
        }
    };
    return params;
}

const updateCounter = async (value) => {
    let params = {
        TableName: Table,
        KeyConditionExpression: "PK = :PK and SK = :SK",
        ExpressionAttributeValues: {
            ":PK": "COUNTER",
            ":SK": "ALL"
        }
    };
    let result = await dynamodb.query(params).promise();
    let response;
    if (value && value !== 0) {
        let newBalance = result.Items[0].Balance + value;
        let newTransactions = (result.Items[0].Transactions + 1);
        params = {
            TableName: Table,
            Key: {
                "PK": "COUNTER",
                "SK": "ALL"
            },
            UpdateExpression: "set Balance = :B, Modified = :M, Transactions = :T",
            ExpressionAttributeValues: {
                ":B": newBalance,
                ":M": now,
                ":T": newTransactions
            },
            ReturnValues: "ALL_NEW"
        }
        response = await dynamodb.update(params, (err, data) => {
            if (err) {
                return err;
            } else {
                return data;
            }
        }).promise();
    }
    return response;
}

const updateAccountBalance = async (item) => {
    let params = {
        TableName: Table,
        KeyConditionExpression: "PK = :PK and SK = :SK",
        ExpressionAttributeValues: {
            ":PK": "PROFILE",
            ":SK": `ACCOUNT#${item.Account}`
        }
    };
    let result = await dynamodb.query(params).promise();
    let response;
    let newBalance = result.Items[0].Balance + item.Value;
    params = {
        TableName: Table,
        Key: {
            "PK": "PROFILE",
            "SK": `ACCOUNT#${item.Account}`
        },
        UpdateExpression: "set Balance = :B",
        ExpressionAttributeValues: {
            ":B": newBalance
        },
        ReturnValues: "ALL_NEW"
    }
    response = await dynamodb.update(params, (err, data) => {
        if (err) {
            return err;
        } else {
            return data;
        }
    }).promise();
}

const responseMessages = {
    SuccessDeposit: {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": "Success!"
    },
    SuccessWithdrawal: {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": "Success!"
    },
    SuccessBalance: {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": {
            "Message": "Success!",
            "Account": ""
        }
    },
    SuccessTransfer: {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": {
            "Message": "Success!",
            "Name": ""
        }
    },
    SuccessStatement: {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": {
            "Message": "Success!",
            "Statement": ""
        }
    },
    LoginFailed: {
        "statusCode": 400,
        "headers": {
            "content-type": "application/json"
        },
        "body": "Login Failed!"
    },
    InvalidAccount: {
        "statusCode": 400,
        "headers": {
            "content-type": "application/json"
        },
        "body": "Invalid account!"
    },
    OperationFailed: {
        "statusCode": 400,
        "headers": {
            "content-type": "application/json"
        },
        "body": "Operation failed!"
    },
    InsufficientFunds: {
        "statusCode": 400,
        "headers": {
            "content-type": "application/json"
        },
        "body": "Insufficient Funds!"
    }
}