const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const GradeLevel = sequelize.define(
  "grade level",
  {
    gradeLevelID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gradeLevel: {
      type: Sequelize.ENUM(
        "NURSERY",
        "KINDER_1",
        "KINDER_2",
        "GRADE_1",
        "GRADE_2",
        "GRADE_3",
        "GRADE_4",
        "GRADE_5",
        "GRADE_6",
        "GRADE_7",
        "GRADE_8",
        "GRADE_9",
        "GRADE_10",
        "GRADE_11",
        "GRADE_12"
      )
    }
  },
  { freezeTableName: true }
);

module.exports = GradeLevel;
