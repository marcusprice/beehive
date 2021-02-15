require('dotenv').config();
const crypto = require('crypto'),
  key = Buffer.from(process.env.CIPHER_KEY),
  iv = Buffer.from(process.env.IV_KEY);

const generateHash = (value) =>
  crypto
    .createHmac('sha256', process.env.PWD_HASH_KEY)
    .update(value)
    .digest('hex');

const encrypt = (value) => {
  const cipher = crypto.createCipheriv('aes256', key, iv);
  let encrypted = cipher.update(value, 'binary', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

const decrypt = (value) => {
  const decipher = crypto.createDecipheriv('aes256', key, iv);
  let decrypted = decipher.update(value, 'hex', 'binary');
  decrypted += decipher.final('binary');

  return decrypted;
};

exports.generateHash = generateHash;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
