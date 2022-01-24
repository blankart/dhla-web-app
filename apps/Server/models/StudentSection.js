const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const StudentSection = sequelize.define(
  "student section",
  {
    studsectID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentID: {
      type: Sequelize.INTEGER
    },
    sectionID: {
      type: Sequelize.INTEGER
    },
    schoolYearID: {
      type: Sequelize.INTEGER
    }
  },
  { 
    freezeTableName: true, 
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = StudentSection;
