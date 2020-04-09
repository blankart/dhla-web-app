const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const ActivityLog = sequelize.define(
  "activity log",
  {
    logID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.ENUM("ADD", "UPDATE", "DELETE")
    },
    oldVal: {
      type: Sequelize.FLOAT
    },
    newVal: {
      type: Sequelize.FLOAT
    },
    date: {
      type: Sequelize.DATE
    },
    teacherID: {
      type: Sequelize.INTEGER
    },
    sectionID: {
      type: Sequelize.INTEGER
    },
    schoolYearID: {
      type: Sequelize.INTEGER
    },
    gradeLevel: {
      type: Sequelize.ENUM(
        "N",
        "K1",
        "K2",
        "G1",
        "G2",
        "G3",
        "G4",
        "G5",
        "G6",
        "G7",
        "G8",
        "G9",
        "G10",
        "G11",
        "G12"
      )
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = ActivityLog;
