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
      type: Sequelize.FLOAT
    },
    quarter: {
      type: Sequelize.ENUM("Q1", "Q2", "Q3", "Q4")
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = Subcomponent;
