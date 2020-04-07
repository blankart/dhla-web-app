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
    description: {
      type: Sequelize.STRING(100)
    },
    dateGiven: {
      type: Sequelize.DATE
    },
    score: {
      type: Sequelize.FLOAT
    },
    total: {
      type: Sequelize.FLOAT
    },
    componentID: {
      type: Sequelize.INTEGER
    },
    subcomponentID: {
      type: Sequelize.INTEGER
    },
    date: {
      type: Sequelize.DATE
    },
    classRecordID: {
      type: Sequelize.INTEGER
    },
    subsectstudID: {
      type: Sequelize.INTEGER
    },
    showLog: {
      type: Sequelize.BOOLEAN
    },
    isUpdated: {
      type: Sequelize.BOOLEAN
    },
    quarter: {
      type: Sequelize.ENUM("Q1", "Q2", "Q3", "Q4")
    }
  },
  { freezeTableName: true }
);

module.exports = Grade;
