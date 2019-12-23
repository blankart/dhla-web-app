const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const SubmissionDeadline = sequelize.define(
  "submission deadline",
  {
    deadlineID: {
      type: Sequelize.INTEGER
    },
    teacherID: {
      type: Sequelize.INTEGER
    },
    dateSet: {
      type: Sequelize.DATE
    },
    deadline: {
      type: Sequelize.DATE
    },
    show: {
      type: Sequelize.BOOLEAN
    }
  },
  { freezeTableName: true }
);

module.exports = SubmissionDeadline;
