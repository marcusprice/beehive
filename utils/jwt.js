const jwt = require('jsonwebtoken');

const signJWT = (authData, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: authData },
      secretKey,
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};

const verifyJWT = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, authData) => {
      if (error) {
        reject(error);
      } else {
        resolve(authData);
      }
    });
  });
};

exports.signJWT = signJWT;
exports.verifyJWT = verifyJWT;
