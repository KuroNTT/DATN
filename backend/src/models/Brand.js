const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng brands
const BrandModel = sequelize.define(
  "brands",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    update_at: { type: DataTypes.DATE },
  },
  { timestamps: false, tableName: "brands" }
);

module.exports = BrandModel;
