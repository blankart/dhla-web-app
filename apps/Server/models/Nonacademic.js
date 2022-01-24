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
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = Nonacademic;
