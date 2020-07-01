const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Teacher = sequelize.define(
  "teacher",
  {
    teacherID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountID: {
      type: Sequelize.INTEGER
    },
    isAdviser: {
      type: Sequelize.BOOLEAN
    }
  },
  { freezeTableName: true }
);

module.exports = Teacher;
