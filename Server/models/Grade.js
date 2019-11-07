const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Grade = sequelize.define(
  "grade",
  {
    gradeID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    score: {
      type: Sequelize.DOUBLE
    },
    total: {
      type: Sequelize.INTEGER(3)
    },
    categoryID: {
      type: Sequelize.INTEGER
    },
    date: {
      type: Sequelize.DATE
    },
    gradeSheetID: {
      type: Sequelize.INTEGER
    },
    entryNum: {
      type: Sequelize.INTEGER(2)
    },
    studentID: {
      type: Sequelize.INTEGER
    },
    showLog: {
      type: Sequelize.BOOLEAN
    },
    isUpdated: {
      type: Sequelize.BOOLEAN
    }
  },
  { freezeTableName: true }
);

module.exports = Grade;
