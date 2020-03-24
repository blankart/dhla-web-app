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
    studentID: {
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
    finalGrade: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    }
  },
  { freezeTableName: true }
);

module.exports = StudentWeightedScore;
