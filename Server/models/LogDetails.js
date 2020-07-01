const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const LogDetails = sequelize.define(
  "log details",
  {
    logdetailsID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    logID: {
      type: Sequelize.INTEGER
    },
    student: {
      type: Sequelize.STRING
    },
    component: {
      type: Sequelize.STRING
    },
    subcomponent: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    oldValue: {
      type: Sequelize.FLOAT
    },
    newValue: {
      type: Sequelize.FLOAT
    }
  },
  { freezeTableName: true }
);

module.exports = LogDetails;
