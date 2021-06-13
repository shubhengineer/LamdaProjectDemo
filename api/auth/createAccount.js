"use strict";
const AwsConfig = require("../aws-common");

const signUp = (email, password, agent = 'none') => {
  return new Promise((resolve) => {
    AwsConfig.initAWS();
    AwsConfig.setCognitoAttributeList(email, agent);
    AwsConfig.getUserPool().signUp(
      email,
      password,
      AwsConfig.getCognitoAttributeList(),
      null,
       (err, result) => {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }
        const response = {
          username: result.user.username,
          userConfirmed: result.userConfirmed,
          userAgent: result.user.client.userAgent,
        };
        return resolve({ statusCode: 201, response: response });
      }
    );
  });
};

module.exports.submit = async (event) => {
  let { email, password } = JSON.parse(event.body);
  const response = await signUp(email, password);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.response)
  };
};
