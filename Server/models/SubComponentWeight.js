const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const SubComponentWeight = sequelize.define(
  "subcomponent weight",
  {
    subcompweightID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gradeSheetID: {
      type: Sequelize.INTEGER
    },
    subCategID: {
      type: Sequelize.INTEGER
    },
    categoryID: {
      type: Sequelize.INTEGER
    },
    compWeight: {
      type: Sequelize.INTEGER(2)
    }
  },
  { freezeTableName: true }
);

module.exports = SubComponentWeight;
