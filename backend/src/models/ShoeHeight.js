const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng shoes height
const ShoeHeightModel = sequelize.define(
  "shoe_heights",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "shoe_heights",
    timestamps: false,
  }
);

module.exports = ShoeHeightModel;
