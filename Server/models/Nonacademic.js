const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Nonacademic = sequelize.define(
  "nonacademic",
  {
    facultyID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountID: {
      type: Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

module.exports = Nonacademic;
