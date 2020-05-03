const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const ActivityLog = sequelize.define(
  "activity log", {
    logID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.ENUM(
        "ADD",
        "UPDATE",
        "DELETE",
        "CHANGE_STATUS",
        "SUBCOMP_UPDATE",
        "TRANSMU_UPDATE"
      )
    },
    classRecordID: {
      type: Sequelize.INTEGER
    },
    position: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    section: {
      type: Sequelize.STRING
    },
    subject: {
      type: Sequelize.STRING
    },
    timestamp: {
      type: Sequelize.DATE
    },
    quarter: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true
  }
);

module.exports = ActivityLog;