require('dotenv').config();
const crypto = require('crypto');

const generateHash = (password) =>
  crypto
    .createHmac('sha256', process.env.PWD_HASH_KEY)
    .update(password)
    .digest('hex');

exports.generateHash = generateHash;
