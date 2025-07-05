const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng VarianSize
const VariantSizeModel = sequelize.define(
  "variant_sizes",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    variant_id: { type: DataTypes.INTEGER },
    size_id: { type: DataTypes.INTEGER },
    stock: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  { timestamps: false, tableName: "variant_sizes" }
);

module.exports = VariantSizeModel;
