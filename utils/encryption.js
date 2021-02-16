// utils/encryption.js
// encryption tools

require('dotenv').config();
const crypto = require('crypto'),
  key = Buffer.from(process.env.CIPHER_KEY),
  iv = Buffer.from(process.env.IV_KEY);

/**
 * @function generateHash
 *
 * @param {string} value - the string to be hashed
 * @returns {string} a hashed version of the the input
 */

const generateHash = (value) =>
  crypto
    .createHmac('sha256', process.env.PWD_HASH_KEY)
    .update(value)
    .digest('hex');

/**
 * @function encrypt
 *
 * @param {string} value - the string to be encrypted
 * @returns {string} encrypted version of the string
 */

const encrypt = (value) => {
  const cipher = crypto.createCipheriv('aes256', key, iv);
  let encrypted = cipher.update(value, 'binary', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

/**
 * @function decrypt
 *
 * @param {string} value - string to be decrypted
 * @returns {string} - decrypted value
 */

const decrypt = (value) => {
  const decipher = crypto.createDecipheriv('aes256', key, iv);
  let decrypted = decipher.update(value, 'hex', 'binary');
  decrypted += decipher.final('binary');

  return decrypted;
};

exports.generateHash = generateHash;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
