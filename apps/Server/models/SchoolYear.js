const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const SchoolYear = sequelize.define(
  "school year",
  {
    schoolYearID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schoolYear: {
      type: Sequelize.STRING(9)
    },
    isActive: {
      type: Sequelize.BOOLEAN
    },
    quarter: {
      type: Sequelize.ENUM("Q1", "Q2", "Q3", "Q4"),
      defaultValue: "Q1"
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = SchoolYear;
