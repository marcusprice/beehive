require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./user');

// gets test params for test suite, otherwise normal db
const dbArgs = {};
if (process.env.NODE_ENV === 'test') {
  dbArgs.dbName = process.env.TEST_DB_NAME;
  dbArgs.dbUsername = process.env.TEST_DB_USERNAME;
  dbArgs.dbPassword = process.env.TEST_DB_PASSWORD;
} else {
  dbArgs.dbName = process.env.DB_NAME;
  dbArgs.dbUsername = process.env.DB_USERNAME;
  dbArgs.dbPassword = process.env.DB_PASSWORD;
}

const db = new Sequelize(dbArgs.dbName, dbArgs.dbUsername, dbArgs.dbPassword, {
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
});

const user = userModel(db, DataTypes);

exports.user = user;
