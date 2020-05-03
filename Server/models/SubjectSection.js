const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const SubjectSection = sequelize.define(
  "subject section",
  {
    subsectID: {
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
    schoolYearID: {
      type: Sequelize.INTEGER
    },
    subjectType: {
      type: Sequelize.ENUM("NON_SHS", "1ST_SEM", "2ND_SEM")
    },
    classRecordID: {
      type: Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

module.exports = SubjectSection;
