require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./user');

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.PASSWORD,
  {
    port: process.env.DB_PORT,
    dialect: 'postgres',
  }
);

const user = userModel(db, DataTypes);
exports.user = user;
