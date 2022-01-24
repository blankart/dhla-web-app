const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Student = sequelize.define(
  "student",
  {
    studentID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountID: {
      type: Sequelize.INTEGER
    },
    fatherName: {
      type: Sequelize.STRING(30)
    },
    fatherAddress: {
      type: Sequelize.STRING(30)
    },
    fatherEmail: {
      type: Sequelize.STRING(30)
    },
    fatherOccupation: {
      type: Sequelize.STRING(30)
    },
    fatherEmployer: {
      type: Sequelize.STRING(30)
    },
    fatherBusinessAdd: {
      type: Sequelize.STRING(30)
    },
    fatherOfficeNum: {
      type: Sequelize.STRING(30)
    },
    motherName: {
      type: Sequelize.STRING(30)
    },
    motherAddress: {
      type: Sequelize.STRING(30)
    },
    motherEmail: {
      type: Sequelize.STRING(30)
    },
    motherOccupation: {
      type: Sequelize.STRING(30)
    },
    motherEmployer: {
      type: Sequelize.STRING(30)
    },
    motherBusinessAdd: {
      type: Sequelize.STRING(30)
    },
    motherOfficeNum: {
      type: Sequelize.STRING(30)
    }
  },
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  }
);

module.exports = Student;
