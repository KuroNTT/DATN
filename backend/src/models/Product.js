const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng products
const ProductModel = sequelize.define(
  "products",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    category_id: { type: DataTypes.INTEGER },
    brand_id: { type: DataTypes.INTEGER },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    price_sale: { type: DataTypes.INTEGER },
    origin_country: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER },
    hot: { type: DataTypes.INTEGER },
    view: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.DATE,
    },
  },
  { timestamps: false, tableName: "products" }
);

module.exports = ProductModel;
