const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const ClassRecordStatus = sequelize.define(
  "class record status",
  {
    classrecstatusID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    classRecordID: {
      type: Sequelize.INTEGER
    },
    q1: {
      type: Sequelize.ENUM("L", "E", "D", "F")
    },
    q2: {
      type: Sequelize.ENUM("L", "E", "D", "F")
    },
    q3: {
      type: Sequelize.ENUM("L", "E", "D", "F")
    },
    q4: {
      type: Sequelize.ENUM("L", "E", "D", "F")
    },
    q1DateSubmitted: {
      type: Sequelize.DATE
    },
    q2DateSubmitted: {
      type: Sequelize.DATE
    },
    q3DateSubmitted: {
      type: Sequelize.DATE
    },
    q4DateSubmitted: {
      type: Sequelize.DATE
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = ClassRecordStatus;
