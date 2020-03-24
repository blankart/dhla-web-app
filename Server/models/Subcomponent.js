const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Subcomponent = sequelize.define(
  "subcomponent",
  {
    subcompID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    classRecordID: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING(50)
    },
    componentID: {
      type: Sequelize.INTEGER
    },
    compWeight: {
      type: Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

module.exports = Subcomponent;
