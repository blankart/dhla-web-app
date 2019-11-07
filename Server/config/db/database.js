const Sequelize = require("sequelize");

module.exports = new Sequelize({
  database: "dhlawebapp",
  username: "root",
  password: "",
  dialect: "mysql"
});
