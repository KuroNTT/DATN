const { timestamp } = require("rxjs");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("tvm_shoes", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

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

//Model mô tả bảng products
const ProductModel = sequelize.define(
  "product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    category_id: { type: DataTypes.INTEGER },
    description: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    price_sale: { type: DataTypes.INTEGER },
    origin_country: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER },
    hot: { type: DataTypes.INTEGER },
    view: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE },
    update_at: { type: DataTypes.DATE },
  },
  { timestamps: false, tableName: "products" }
);

// Export Module
module.exports = {
  CategoryModel,
  ProductModel,
};
