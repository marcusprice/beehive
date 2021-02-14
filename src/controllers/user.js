const { user } = require('../models/db');
const { generateHash } = require('../../utils/encryption');

const createNewUser = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    user
      .create({ email: email, password: generateHash(password) })
      .then((result) => {
        delete result.dataValues['password'];
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.createNewUser = createNewUser;
