const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const TeacherLoad = sequelize.define(
  "teacher load",
  {
    loadID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subjectID: {
      type: Sequelize.INTEGER
    },
    sectionID: {
      type: Sequelize.INTEGER
    },
    teacherID: {
      type: Sequelize.INTEGER
    },
    schoolYear: {
      type: Sequelize.STRING(9)
    },
    academicTerm: {
      type: Sequelize.ENUM(
        "SEMESTER_1",
        "SEMESTER_2",
        "QUARTER_1",
        "QUARTER_2",
        "QUARTER_3",
        "QUARTER_4"
      )
    }
  },
  { freezeTableName: true }
);

module.exports = TeacherLoad;
