const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const ParentGuardian = sequelize.define(
  "parent guardian",
  {
    parentID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountID: {
      type: Sequelize.INTEGER
    },
    studentID: {
      type: Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

module.exports = ParentGuardian;
