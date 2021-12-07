var balance =
{
    "Operation": "Balance",
    "Account": "1001",
    "Password": "abc123"
}

var deposit =
{
    "Operation": "Deposit",
    "Account": "1001",
    "Value": 100
}

var withdrawal =
{
    "Operation": "Withdrawal",
    "Account": "1001",
    "Password": "abc123",
    "Value": 10
}

var transfer =
{
    "Operation": "Transfer",
    "Account": "1001",
    "Password": "abc123",
    "Destiny": "1002",
    "Value": 20,
}

var statement =
{
    "Operation": "Statement",
    "Account": "1001",
    "Password": "abc123",
    "Period": "202111"
}

var model =
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "TransactionModel",
    "oneOf": [
        {
            "type": "object",
            "required": ["Operation", "Account", "Password"],
            "additionalProperties": false,
            "properties": {
                "Operation": { "enum": ["Balance"] },
                "Account": { "type": "string", "pattern": "[0-9]{4}" },
                "Password": { "type": "string" }
            }
        },
        {
            "type": "object",
            "required": ["Operation", "Account", "Password", "Value"],
            "additionalProperties": false,
            "properties": {
                "Operation": { "enum": ["Deposit", "Withdrawal"] },
                "Account": { "type": "string", "pattern": "[0-9]{4}" },
                "Password": { "type": "string" },
                "Value": { "type": "number" }
            }
        },
        {
            "type": "object",
            "required": ["Operation", "Account", "Password", "Value", "Destiny"],
            "additionalProperties": false,
            "properties": {
                "Operation": { "enum": ["Transfer"] },
                "Account": { "type": "string", "pattern": "[0-9]{4}" },
                "Password": { "type": "string" },
                "Value": { "type": "number" },
                "Destiny": { "type": "string", "pattern": "[0-9]{4}" }
            }
        },
        {
            "type": "object",
            "required": ["Operation", "Account", "Password", "Period"],
            "additionalProperties": false,
            "properties": {
                "Operation": { "enum": ["Statement"] },
                "Account": { "type": "string", "pattern": "[0-9]{4}" },
                "Password": { "type": "string" },
                "Period": { "type": "string", "pattern": "[0-9]{6}" }
            }
        }
    ]
}


var model =
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "TransactionCreateReadModel",
    "oneOf": [
        {
            "type": "object",
            "required": ["Operation", "Payload"],
            "properties": {
                "Operation": {
                    "type": "string",
                    "enum": ["create"]
                },
                "Payload": {
                    "type": "object",
                    "required": ["Item"],
                    "properties": {
                        "Item": {
                            "type": "object",
                            "required": ["PK", "SK", "Type", "Value"],
                            "properties": {
                                "PK": {
                                    "type": "string",
                                    "enum": ["TRANSACTION"]
                                },
                                "SK": { "type": "string" },
                                "Type": {
                                    "type": "string",
                                    "enum": ["deposit", "withdrawal", "credit"]
                                },
                                "Value": { "type": "number" }
                            },
                            "if": {
                                "properties": { "Type": { "const": "debit" } }
                            },
                            "then": {
                                "properties": {
                                    "Destiny": { "type": "number" }
                                },
                                "required": ["Destiny"]
                            }
                        }
                    }
                }
            }
        },
        {
            "type": "object",
            "required": ["Operation", "Payload"],
            "properties": {
                "Operation": {
                    "type": "string",
                    "enum": ["read"]
                },
                "Payload": {
                    "type": "object",
                    "required": ["KeyConditionExpression", "ExpressionAttributeValues"],
                    "properties": {
                        "KeyConditionExpression": {
                            "type": "string",
                            "enum": ["PK = :PK and SK = :SK", "PK = :PK and begins_with(SK, :SK)"]
                        },
                        "ExpressionAttributeValues": {
                            "type": "object",
                            "properties": {
                                ":PK": {
                                    "type": "string",
                                    "enum": ["PROFILE", "TRANSACTION"]
                                },
                                ":SK": { "type": "string" }
                            },
                            "required": [":PK", ":SK"]
                        }
                    }
                }
            }
        }
    ]
}


var model =
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "TransactionCreateModel",
    "type": "object",
    "properties": {
        "Operation": {
            "type": "string",
            "enum": ["create", "read"]
        }
    },
    "required": ["Operation"],
    "if": {
        "properties": { "Operation": { "const": "create" } }
    },
    "then": {
        "properties": {
            "Payload": {
                "type": "object",
                "properties": {
                    "Item": {
                        "type": "object",
                        "properties": {
                            "PK": {
                                "type": "string",
                                "enum": ["TRANSACTION"]
                            },
                            "SK": { "type": "string" },
                            "Type": {
                                "type": "string",
                                "enum": ["deposit", "withdrawal", "debit", "credit"]
                            },
                            "Value": { "type": "number" }
                        },
                        "required": ["PK", "SK", "Type", "Value"],
                        "if": {
                            "properties": { "Type": { "const": "debit" } }
                        },
                        "then": {
                            "properties": {
                                "Destiny": { "type": "number" }
                            },
                            "required": ["Destiny"]
                        }
                    }
                },
                "required": ["Item"]
            }
        }
    },
    "else": {
        "properties": {
            "Payload": {
                "type": "object",
                "properties": {
                    "KeyConditionExpression": {
                        "type": "string",
                        "enum": ["PK = :PK and SK = :SK", "PK = :PK and begins_with(SK, :SK)"]
                    },
                    "ExpressionAttributeValues": {
                        "type": "object",
                        "properties": {
                            ":PK": {
                                "type": "string",
                                "enum": ["PROFILE", "TRANSACTION"]
                            },
                            ":SK": { "type": "string" }
                        },
                        "required": [":PK", ":SK"]
                    }
                },
                "required": ["KeyConditionExpression", "ExpressionAttributeValues"]
            }
        }
    }
}


var model =
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "TransactionReadModel",
    "type": "object",
    "properties": {
        "Operation": {
            "type": "string",
            "enum": ["read"]
        },
        "Payload": {
            "type": "object",
            "properties": {
                "KeyConditionExpression": {
                    "type": "string",
                    "enum": ["PK = :PK and SK = :SK", "PK = :PK and begins_with(SK, :SK)"]
                },
                "ExpressionAttributeValues": {
                    "type": "object",
                    "properties": {
                        ":PK": {
                            "type": "string",
                            "enum": ["PROFILE", "TRANSACTION"]
                        },
                        ":SK": { "type": "string" }
                    },
                    "required": [":PK", ":SK"]
                }
            },
            "required": ["KeyConditionExpression", "ExpressionAttributeValues"]
        }
    },
    "required": ["Operation", "Payload"]
};
