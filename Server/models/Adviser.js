const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Adviser = sequelize.define(
  "adviser",
  {
    adviserID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sectionID: { type: Sequelize.INTEGER },
    schoolYearID: { type: Sequelize.INTEGER },
    teacherID: { type: Sequelize.INTEGER }
  },
  { freezeTableName: true }
);

module.exports = Adviser;
