const { user } = require('../models/db');
const { generateHash, encrypt } = require('../../utils/encryption');

/**
 * @function createNewUser
 *
 * @param {object} - an object containing an email and password for the new user
 * @returns {object} - an object of the user data
 */

const createNewUser = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    user
      .create({
        lookupValue: generateHash(email),
        email: encrypt(email),
        password: generateHash(password),
      })
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
