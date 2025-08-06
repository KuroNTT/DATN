const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

// Model mô tả bảng voucher_users
const VoucherUserModel = sequelize.define(
  "voucher_users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    used_at: {
      type: DataTypes.BOOLEAN, // tinyint(1) tương ứng BOOLEAN
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "voucher_users",
    timestamps: false,
  }
);

module.exports = VoucherUserModel;
