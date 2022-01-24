const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const ParentGuardian = sequelize.define(
  "parent guardian", {
    parentID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountID: {
      type: Sequelize.INTEGER
    },
    studentIDs: {
      type: Sequelize.STRING(1000)
    }
  }, 
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = ParentGuardian;