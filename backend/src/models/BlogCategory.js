// models/BlogCategoryModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const BlogCategoryModel = sequelize.define(
  "blog_categories",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: false,
    tableName: "blog_categories",
  }
);

module.exports = BlogCategoryModel;
