const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const ComponentWeight = sequelize.define(
  "component weight",
  {
    componentWeightID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    categoryID: {
      type: Sequelize.INTEGER
    },
    subjectID: {
      type: Sequelize.INTEGER
    },
    compWeight: {
      type: Sequelize.INTEGER(2)
    }
  },
  { freezeTableName: true }
);

module.exports = ComponentWeight;
