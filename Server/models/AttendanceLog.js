const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const AttendanceLog = sequelize.define(
  "attendance log",
  {
    attendanceID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: { type: Sequelize.DATE },
    schoolYearID: { type: Sequelize.INTEGER },
    quarter: {
      type: Sequelize.ENUM("Q1", "Q2", "Q3", "Q4")
    },
    month: { type: Sequelize.INTEGER(2) },
    daysPresent: { type: Sequelize.INTEGER(2) },
    daysTardy: { type: Sequelize.INTEGER(2) },
    totalDays: { type: Sequelize.INTEGER(2) },
    teacherID: { type: Sequelize.INTEGER },
    studentID: { type: Sequelize.INTEGER }
  },
  { freezeTableName: true }
);

module.exports = AttendanceLog;
