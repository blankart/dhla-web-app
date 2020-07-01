const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const SubjectSectionStudent = sequelize.define(
  "subject section student",
  {
    subsectstudID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studsectID: {
      type: Sequelize.INTEGER
    },
    subsectID: {
      type: Sequelize.INTEGER
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = SubjectSectionStudent;
