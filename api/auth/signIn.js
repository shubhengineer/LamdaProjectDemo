"use strict";
const AwsConfig = require("../aws-common");

const signIn = (email, password) => {
  return new Promise((resolve) => {
    AwsConfig.getCognitoUser(email).authenticateUser(
      AwsConfig.getAuthDetails(email, password),
      {
        onSuccess: (result) => {
          const token = {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          };
          return resolve({
            statusCode: 200,
            response: AwsConfig.decodeJWTToken(token),
          });
        },

        onFailure: (err) => {
          return resolve({
            statusCode: 400,
            response: err.message || JSON.stringify(err),
          });
        },
      }
    );
  });
};

module.exports.submit = async (event) => {
  let { email, password } = JSON.parse(event.body);
  const response = await signIn(email, password);
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.response),
  };
};
