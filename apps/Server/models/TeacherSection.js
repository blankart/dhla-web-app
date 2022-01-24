const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const TeacherSection = sequelize.define(
  "teacher section",
  {
    teachersectionID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sectionID: { type: Sequelize.INTEGER },
    schoolYearID: { type: Sequelize.INTEGER },
    teacherID: { type: Sequelize.INTEGER }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = TeacherSection;
