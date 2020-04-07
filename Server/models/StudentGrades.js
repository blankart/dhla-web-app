const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const StudentGrades = sequelize.define(
  "student grades",
  {
    studentGradesID: {
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
    q1FinalGrade: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    q2FinalGrade: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    q3FinalGrade: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    q4FinalGrade: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    },
    ave: {
      type: Sequelize.FLOAT,
      defaultValue: -1
    }
  },
  { freezeTableName: true }
);

module.exports = StudentGrades;
