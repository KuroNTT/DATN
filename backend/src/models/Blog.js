const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // bạn đã có file này

const BlogModel = sequelize.define(
  "blog",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT },
    slug: { type: DataTypes.STRING },
    thumbnail: { type: DataTypes.STRING },
    author_id: { type: DataTypes.INTEGER },
    category_id: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    update_at: { type: DataTypes.DATE },
    is_published: { type: DataTypes.BOOLEAN },
    sort_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER },
  },
  {
    timestamps: false,
    tableName: "blogs",
  }
);
module.exports = BlogModel;
