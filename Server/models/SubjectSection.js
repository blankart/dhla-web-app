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
    classRecordID: {
      type: Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

module.exports = SubjectSection;
