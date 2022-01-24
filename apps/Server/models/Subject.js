const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Subject = sequelize.define(
  "subject",
  {
    subjectID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subjectCode: {
      type: Sequelize.STRING
    },
    subjectName: {
      type: Sequelize.STRING
    },
    archived: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    },
    subjectType: {
      type: Sequelize.ENUM(
        "N",
        "K1",
        "K2",
        "G1",
        "G2",
        "G3",
        "G4",
        "G5",
        "G6",
        "G7",
        "G8",
        "G9",
        "G10",
        "CORE",
        "ACAD-APPLIED",
        "ACAD-SPECIALIZED",
        "TVL-APPLIED",
        "TVL-SPECIALIZED",
        "SPORTS-APPLIED",
        "SPORTS-SPECIALIZED",
        "AAD-APPLIED",
        "AAD-SPECIALIZED"
      )
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = Subject;
