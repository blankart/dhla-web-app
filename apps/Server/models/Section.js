const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Section = sequelize.define(
  "section",
  {
    sectionID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sectionName: {
      type: Sequelize.STRING(100)
    },
    gradeLevel: {
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
        "G11",
        "G12"
      )
    },
    archived: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = Section;
