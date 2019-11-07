const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Subject = sequelize.define(
  "subject",
  {
    subjectID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subjectCode: {
      type: Sequelize.STRING(10)
    },
    subjectTitle: {
      type: Sequelize.STRING(50)
    },
    subjectDescription: {
      type: Sequelize.STRING
    }
  },
  { freezeTableName: true }
);

module.exports = Subject;
