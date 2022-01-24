const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const StudentGrades = sequelize.define(
  "student grades",
  {
    studentgradesID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studsectID: {
      type: Sequelize.INTEGER
    },
    schoolYearID: {
      type: Sequelize.INTEGER
    },
    quarter: {
      type: Sequelize.ENUM("Q1", "Q2", "Q3", "Q4")
    },
    grade: {
      type: Sequelize.FLOAT
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = StudentGrades;
