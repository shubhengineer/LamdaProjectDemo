"use strict";
const uuid = require('node-uuid');
const AWS = require('aws-sdk');
const dynamoDb = process.env.IS_OFFLINE === 'true' ?
  new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  }) :
  new AWS.DynamoDB.DocumentClient();

const symbolCheck = (symbol) => {
  return new Promise((resolve) => {

    const symbolId = uuid.v4();
    const done = false;
    const params = {
      TableName: process.env.SYMBOL_TABLE,
      Item: {
        symbolId,
        symbol,
        done,
      },
    };

    dynamoDb.put(params, (error) => {
      if (error) {
        return resolve({ statusCode: 400, response: error });
      }
      return resolve({ statusCode: 200, response: symbol });
    });
  });
};

module.exports.submit = async (event) => {
  let { symbol } = JSON.parse(event.body);
  const response = await symbolCheck(symbol);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.response),
  };
};
