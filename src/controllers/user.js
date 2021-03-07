const { user } = require('../models/db');
const { generateHash, encrypt, decrypt } = require('../../utils/encryption');

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

const getUser = (hashedEmail) => {
  return new Promise((resolve, reject) => {
    user
      .findAll({
        where: {
          lookupValue: hashedEmail,
        },
      })
      .then((result) => {
        if (result.length === 1) {
          resolve(result[0]);
        } else {
          reject('Email is not registered');
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateUser = (email, userData) => {
  return new Promise((resolve, reject) => {
    user
      .update(
        {
          lookupValue: generateHash(userData.email),
          email: encrypt(userData.email),
          displayName: encrypt(userData.displayName),
          firstName: encrypt(userData.firstName),
          lastName: encrypt(userData.lastName),
        },
        {
          where: {
            lookupValue: generateHash(email),
          },
          returning: true,
        }
      )
      .then((data) => {
        data = data[1][0].dataValues;

        updatedData = {
          email: decrypt(data.email),
          displayName: decrypt(data.displayName),
          firstName: decrypt(data.firstName),
          lastName: decrypt(data.lastName),
        };
        resolve(updatedData);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const changePassword = (email, newPassword) => {
  return new Promise((resolve, reject) => {
    user
      .update(
        {
          password: generateHash(newPassword),
        },
        { where: { lookupValue: generateHash(email) } }
      )
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const authenticateUser = (email, password) => {
  const emailHashed = generateHash(email);
  const passwordHashed = generateHash(password);

  return new Promise(async (resolve, reject) => {
    try {
      userData = await getUser(emailHashed);

      if (userData.password === passwordHashed) {
        const userOutput = formatUserOutput(userData);
        resolve(userOutput);
      } else {
        //wrong password
        reject('Incorrect password');
      }
    } catch (err) {
      reject(err);
    }
  });
};

const formatUserOutput = ({ email, displayName, firstName, lastName }) => {
  return {
    email: email ? decrypt(email) : null,
    displayName: displayName ? decrypt(displayName) : null,
    firstName: firstName ? decrypt(firstName) : null,
    lastName: lastName ? decrypt(lastName) : null,
  };
};

exports.createNewUser = createNewUser;
exports.updateUser = updateUser;
exports.changePassword = changePassword;
exports.authenticateUser = authenticateUser;
