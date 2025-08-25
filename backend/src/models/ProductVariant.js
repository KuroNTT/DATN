const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng Product Variants
// const ProductVariantModel = sequelize.define(
//   "product_variants",
//   {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     product_id: { type: DataTypes.INTEGER },
//     color_id: { type: DataTypes.INTEGER },
//     shoe_height_id: { type: DataTypes.INTEGER },
//     style_code: { type: DataTypes.STRING },
//     image_url: { type: DataTypes.STRING },
//     status: { type: DataTypes.INTEGER },
//     created_at: { type: DataTypes.DATE },
//     updated_at: { type: DataTypes.DATE },
//   },
//   {
//     timestamps: false,
//     tableName: "product_variants",
//   }
// );

const ProductVariantModel = sequelize.define('product_variants', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, field: 'product_id' },
  color_id: { type: DataTypes.INTEGER, field: 'color_id' },
  shoe_height_id: { type: DataTypes.INTEGER, field: 'shoe_height_id' },
  style_code: DataTypes.STRING,
  image_url: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, { tableName: 'product_variants', timestamps: false });


module.exports = ProductVariantModel;
