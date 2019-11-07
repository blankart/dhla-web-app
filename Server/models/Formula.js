const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Formula = sequelize.define(
  "formula",
  {
    formulaID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subjectID: {
      type: Sequelize.INTEGER
    },
    categoryID: {
      type: Sequelize.INTEGER
    },
    compPercentage: {
      type: Sequelize.INTEGER(2)
    },
    isShs: {
      type: Sequelize.INTEGER(1)
    }
  },
  { freezeTableName: true }
);

module.exports = Formula;
