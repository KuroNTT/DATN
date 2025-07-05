const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng Product Variants
const ProductVariantModel = sequelize.define(
  "product_variants",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER },
    color_id: { type: DataTypes.INTEGER },
    shoe_height_id: { type: DataTypes.INTEGER },
    style_code: { type: DataTypes.STRING },
    image_url: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: false,
    tableName: "product_variants",
  }
);

module.exports = ProductVariantModel;
