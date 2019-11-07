const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Section = sequelize.define(
  "section",
  {
    sectionID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    teacherID: {
      type: Sequelize.INTEGER
    },
    sectionName: {
      type: Sequelize.STRING(20)
    },
    gradeLevelID: {
      type: Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

module.exports = Section;
