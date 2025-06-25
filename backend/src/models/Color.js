const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng Color
const ColorModel = sequelize.define(
  "colors",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    color_name: { type: DataTypes.STRING },
    original_name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
  },
  { timestamps: false, tableName: "colors" }
);

module.exports = ColorModel;
