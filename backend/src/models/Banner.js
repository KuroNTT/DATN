const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng Banner
const BannerModel = sequelize.define(
  "banners",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image_url: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    start_date: { type: DataTypes.DATE },
    end_date: { type: DataTypes.DATE },
    product_id: { type: DataTypes.INTEGER },
    category_id: { type: DataTypes.INTEGER },
    created_by: { type: DataTypes.INTEGER },
    position: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  { timestamps: false, tableName: "banners" }
);

module.exports = BannerModel;
