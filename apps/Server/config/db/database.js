const Sequelize = require("sequelize");

// Configuration for Mac OS
module.exports = new Sequelize({
  host: 'sql6.freemysqlhosting.net',
  database: "sql6467710",
  username: "sql6467710",
  password: "2KHNumlSez",
  port: 3306,
  dialect: "mysql",
  logging: false,
});
