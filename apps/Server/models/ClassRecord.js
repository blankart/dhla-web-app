const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const ClassRecord = sequelize.define(
  "class record",
  {
    classRecordID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dateCreated: {
      type: Sequelize.DATE
    },
    dateModified: {
      type: Sequelize.DATE
    },
    q1Transmu: {
      type: Sequelize.ENUM("60", "55", "50")
    },
    q2Transmu: {
      type: Sequelize.ENUM("60", "55", "50")
    },
    q3Transmu: {
      type: Sequelize.ENUM("60", "55", "50")
    },
    q4Transmu: {
      type: Sequelize.ENUM("60", "55", "50")
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = ClassRecord;
