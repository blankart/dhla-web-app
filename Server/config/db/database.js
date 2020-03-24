const Sequelize = require("sequelize");

// Configuration for Mac OS
module.exports = new Sequelize({
  database: "dhlawebapp",
  username: "root",
  password: "",
  dialect: "mysql"
});
