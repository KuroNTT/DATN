const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng Sizes
const SizeModel = sequelize.define(
  "products",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    size: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    update_at: { type: DataTypes.DATE },
  },
  { timestamps: false, tableName: "sizes" }
);

module.exports = SizeModel;
