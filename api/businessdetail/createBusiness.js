"use strict";
const uuid = require("node-uuid");
const AWS = require("aws-sdk");
var jwt = require("jsonwebtoken");
var jwkToPem = require("jwk-to-pem");
const dynamoDb =
  process.env.IS_OFFLINE === "true"
    ? new AWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000",
      })
    : new AWS.DynamoDB.DocumentClient();

const createBusiness = (businessName, address, phoneNumber, businessInfo) => {
  return new Promise((resolve) => {
    const jwk = `https://cognito-idp.{region}.amazonaws.com/{us-west-2_x27uuxhkr}/.well-known/jwks.json`;
    //console.log(url,"urllllllllllllllllll")

    var pem = jwkToPem(jwk);
    const response = jwt.verify(
      token,
      pem,
      { algorithms: ["RS256"] },
      function (err, decodedToken) {}
    );
    console.log(response, "testokennnnnnnnnnnnnnnnn");
    // Cognito Token Verify
    // Cognito TOken -> USerID
    // UserID -> Business if Business available to Update else Insert
    // Business available -> Phone Number check karna hai if phone number available to insert/update karna hai otherweise
    // Error

    const businessId = uuid.v4();
    const params = {
      TableName: process.env.BUSINESS_TABLE,
      Item: {
        businessId,
        userId,
        businessName,
        address,
        phoneNumber,
        businessInfo,
      },
    };
    const params = {
      TableName: process.env.BUSINESS_TABLE,
      Item: {
        phoneNumber,
      },
    };
    dynamoDb.scan(parames, (error, result) => {
      if (error) {
        res.status(400).json({ error: "Error retrieving Todos" });
      }
    });

    dynamoDb.scan(params, (error, result) => {
      if (error) {
        res.status(400).json({ error: "Error retrieving Todos" });
      }
    });

    const { userId } = result.item;
    if (userId) {
      return resolve({ statusCode: 400, response: "user is exist" });
    } else {
      dynamoDb.put(params, (error) => {
        if (error) {
          return resolve({ statusCode: 400, response: error });
        }
        return resolve({ statusCode: 200, response: symbol });
      });
    }
  });
};

module.exports.submit = async (event) => {
  let { businessName, address, phoneNumber, businessInfo } = JSON.parse(
    event.body
  );
  const response = await createBusiness(
    businessName,
    address,
    phoneNumber,
    businessInfo
  );
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.response),
  };
};
