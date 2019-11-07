const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const GradeSheet = sequelize.define(
  "grade sheet",
  {
    gradeSheetID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schoolYear: {
      type: Sequelize.STRING(10)
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
    },
    dateCreated: {
      type: Sequelize.DATE
    },
    dateModified: {
      type: Sequelize.DATE
    },
    isSubmitted: {
      type: Sequelize.BOOLEAN
    },
    subjectID: {
      type: Sequelize.INTEGER
    },
    sectionID: {
      type: Sequelize.INTEGER
    },
    gradeLevelID: {
      type: Sequelize.INTEGER
    },
    teacherID: {
      type: Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

module.exports = GradeSheet;
