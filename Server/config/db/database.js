const Sequelize = require("sequelize");

// Configuration for Mac OS 
module.exports = new Sequelize({
  database: "dwlawebapp",
  username: "root",
  password: "",
  dialect: "mysql"
});
