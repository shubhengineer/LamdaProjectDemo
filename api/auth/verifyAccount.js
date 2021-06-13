"use strict";
const AwsConfig = require("../aws-common");

const verifyAccount = (email, code) => {
  return new Promise((resolve) => {
    AwsConfig.getCognitoUser(email).confirmRegistration(
      code,
      true,
      (err, result) => {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }
        return resolve({ statusCode: 200, response: result });
      }
    );
  });
};

module.exports.submit = async (event) => {
  let { email, code } = JSON.parse(event.body);
  const response = await verifyAccount(email, code);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.response),
  };
};
