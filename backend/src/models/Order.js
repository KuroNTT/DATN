const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng Order
const OrderModel = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    customer: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    customer_phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    customer_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    admin_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order_code: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

module.exports = OrderModel;
