const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng Product Images
const ProductImageModel = sequelize.define(
  "product_images",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    variant_id: { type: DataTypes.INTEGER },
    image_url: { type: DataTypes.STRING },
    created_at: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.STRING },
  },
  { timestamps: false, tableName: "product_images" }
);

module.exports = ProductImageModel;
