const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const OrderDetailModel = sequelize.define(
  "order_details",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_details", // tên bảng trong DB
    timestamps: false,
  }
);

module.exports = OrderDetailModel;
