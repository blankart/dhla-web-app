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
    schoolYear: { type: Sequelize.STRING(9) },
    academicYear: {
      type: Sequelize.ENUM(
        "SEMESTER_1",
        "SEMESTER_2",
        "QUARTER_1",
        "QUARTER_2",
        "QUARTER_3",
        "QUARTER_4"
      )
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
