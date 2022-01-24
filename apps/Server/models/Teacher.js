const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Teacher = sequelize.define(
  "teacher",
  {
    teacherID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountID: {
      type: Sequelize.INTEGER
    },
    isAdviser: {
      type: Sequelize.BOOLEAN
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = Teacher;
