const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const AdvisoryTable = sequelize.define(
  "advisory table",
  {
    adviserID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gradeLevelID: { type: Sequelize.INTEGER },
    sectionID: { type: Sequelize.INTEGER },
    schoolYear: { type: Sequelize.STRING(9) },
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
    teacherID: { type: Sequelize.INTEGER }
  },
  { freezeTableName: true }
);

module.exports = AdvisoryTable;
