const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Component = sequelize.define(
  "component",
  {
    componentID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subjectID: {
      type: Sequelize.INTEGER
    },
    component: {
      type: Sequelize.ENUM("FA", "WW", "PT", "QE")
    },
    compWeight: {
      type: Sequelize.FLOAT
    }
  },
  { freezeTableName: true }
);

module.exports = Component;
