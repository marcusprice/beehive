/**
 * @function user
 *
 * @param {object} sequelize - instance of sequelize
 * @param {object} DataTypes - sequelize DataTypes object
 * @returns {object} - user model object
 */

const user = (sequelize, DataTypes) =>
  sequelize.define('User', {
    lookupValue: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

module.exports = user;
