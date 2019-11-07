const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const Category = sequelize.define(
  "category",
  {
    categoryID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    categoryName: {
      type: Sequelize.ENUM("FORMATIVE", "WRITTEN", "PT", "QUARTERLY_EXAM")
    }
  },
  { freezeTableName: true }
);

module.exports = Category;
