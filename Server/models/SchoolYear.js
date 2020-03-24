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
    }
  },
  { freezeTableName: true }
);

module.exports = SchoolYear;
