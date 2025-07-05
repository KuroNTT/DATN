const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng categories
const CategoryModel = sequelize.define(
  "categories",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false, tableName: "categories" }
);

module.exports = CategoryModel;
