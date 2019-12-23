const Sequelize = require("sequelize");
const sequelize = require("../config/db/database");

const SubCategory = sequelize.define(
  "subcategory",
  {
    subCategID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    categoryName: {
      type: Sequelize.STRING(20)
    }
  },
  { freezeTableName: true }
);

module.exports = SubCategory;
