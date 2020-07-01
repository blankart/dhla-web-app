const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const StudentFinalGrade = sequelize.define(
  "student final grade",

  {
    finalGradeID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schoolYearID: {
      type: Sequelize.INTEGER
    },
    studsectID: {
      type: Sequelize.INTEGER
    },
    grade: {
      type: Sequelize.FLOAT
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = StudentFinalGrade;
