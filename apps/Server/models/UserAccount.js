const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const UserAccount = sequelize.define(
  "user account", {
    accountID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING.BINARY
    },
    isActive: {
      type: Sequelize.BOOLEAN
    },
    position: {
      type: Sequelize.BOOLEAN
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    middleName: {
      type: Sequelize.STRING
    },
    suffix: {
      type: Sequelize.STRING(10)
    },
    nickname: {
      type: Sequelize.STRING(50)
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    contactNum: {
      type: Sequelize.STRING(11)
    },
    address: {
      type: Sequelize.STRING(50)
    },
    province: {
      type: Sequelize.STRING(20)
    },
    city: {
      type: Sequelize.STRING(25)
    },
    region: {
      type: Sequelize.STRING(15)
    },
    zipcode: {
      type: Sequelize.STRING(4)
    },
    civilStatus: {
      type: Sequelize.ENUM("SINGLE", "MARRIED", "WIDOWED", "OTHERS")
    },
    sex: {
      type: Sequelize.ENUM("M", "F")
    },
    citizenship: {
      type: Sequelize.STRING(20)
    },
    birthDate: {
      type: Sequelize.DATE
    },
    birthPlace: {
      type: Sequelize.STRING(25)
    },
    religion: {
      type: Sequelize.STRING(20)
    },
    emergencyName: {
      type: Sequelize.STRING(30)
    },
    emergencyAddress: {
      type: Sequelize.STRING(50)
    },
    emergencyTelephone: {
      type: Sequelize.STRING(50)
    },
    emergencyCellphone: {
      type: Sequelize.STRING(50)
    },
    emergencyEmail: {
      type: Sequelize.STRING(30)
    },
    emergencyRelationship: {
      type: Sequelize.STRING(15)
    }
  }, 
  {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true,
    paranoid: true,
  }

);

module.exports = UserAccount;