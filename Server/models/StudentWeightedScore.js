const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const StudentWeightedScore = sequelize.define(
  "student weighted score",
  {
    weightedScoreID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subsectstudID: {
      type: Sequelize.INTEGER
    },
    classRecordID: {
      type: Sequelize.INTEGER
    },
    faWS: {
      type: Sequelize.FLOAT
    },
    wwWS: {
      type: Sequelize.FLOAT
    },
    ptWS: {
      type: Sequelize.FLOAT
    },
    qeWS: {
      type: Sequelize.FLOAT
    },
    actualGrade: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    transmutedGrade50: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    transmutedGrade55: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    transmutedGrade60: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    quarter: {
      type: Sequelize.ENUM("Q1", "Q2", "Q3", "Q4")
    }
  },
  { freezeTableName: true }
);

module.exports = StudentWeightedScore;
