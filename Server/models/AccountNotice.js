const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const AccountNotice = sequelize.define(
  "account notice",
  {
    accountnoticeID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountID: {
      type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.STRING(100)
    }
  },
  { freezeTableName: true }
);

module.exports = AccountNotice;
