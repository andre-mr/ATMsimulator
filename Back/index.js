const AWS = require('aws-sdk');
let dynamodb = new AWS.DynamoDB.DocumentClient();

const Table = "ATMsimulator";
let date, now, payload, balance, result, response;

exports.handler = async (event) => {


    date = new Date();
    now = date.toISOString();
    const operation = event.Operation;

    switch (operation) {
        case 'Balance':
            balance = await validateLogin(event);
            if (balance && !Number.isNaN(balance)){
                let message = responseMessages.SuccessBalance;
                message.body.Value = balance;
                return message;
            }else{
                return responseMessages.LoginFailed;
            }

        case 'Deposit':
            result = await validateAccount(event);
            if (result && result.Active){
                payload = formatDeposit(event);
                response = await dynamodb.put(payload).promise();
                if (response){
                    return responseMessages.Success;
                }else{
                    return responseMessages.OperationFailed;
                }
            }else{
                return responseMessages.InvalidAccount;
            }

        case 'Withdrawal':
            balance = await validateLogin(event);
            if (balance && balance >= event.Value){
                payload = formatWithdrawal(event);
                response = await dynamodb.put(payload).promise();
                if (response){
                    return responseMessages.Success;
                }else{
                    return responseMessages.OperationFailed;
                }
            }else{
                return responseMessages.LoginFailed;
            }
        
        case "Transfer":
            let EventAccount = {
                "Account": event.Account
            };
            let EventDestiny = {
                "Account": event.Destiny
            };
            let validatedAccount = await validateLogin(EventAccount);
            let validatedDestiny = await validateAccount(EventDestiny);
            if (!validatedDestiny || !validatedDestiny.Active){
                return responseMessages.InvalidAccount;
            }else if (!validatedAccount){
                //return responseMessages.LoginFailed;
                return validatedAccount;
            }else if (validatedAccount.balance < event.Value){
                return responseMessages.InsufficientFunds;
            }else{
                payload = formatTransferOut(event);
                payload.Name = validatedDestiny.Name;
                response = await dynamodb.put(payload).promise();
                if (response){
                    payload = formatTransferIn(event);
                    payload.Name = validatedAccount.Name;
                    response = await dynamodb.put(payload).promise();
                    if (response){
                        response = responseMessages.SuccessTransfer;
                        response.Name = validatedDestiny.Name;
                        return response;
                    }else{
                        return responseMessages.OperationFailed;
                    }
                }else{
                    return responseMessages.OperationFailed;
                }
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
    if (result.Items.length > 0){
        result = result.Items[0];
        if (result.Active && (result.Password == e.Password)){
            return result;
        }else{
            return null;
        };
    }else{
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
    if (result.Items.length > 0){
        return result.Items[0];
    }else{
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

const formatTransferIn = (e) => {
    let params = {
        TableName: Table,
        Item: {
            "PK": "TRANSACTION",
            "SK": `ACCOUNT#${e.Destiny}#${now}`,
            "Type": "Credit",
            "Origin": e.Account,
            "Value": e.Value
        }
    }
    return params;
}

const formatTransferOut = (e) => {
    let params = {
        TableName: Table,
        Item: {
            "PK": "TRANSACTION",
            "SK": `ACCOUNT#${e.Account}#${now}`,
            "Type": "Debit",
            "Destiny": e.Destiny,
            "Value": e.Value
        }
    }
    return params;
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
            "Value": 0
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