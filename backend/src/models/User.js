const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng User
const UserModel = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, require: true },
    password: { type: DataTypes.STRING, require: true },
    name: { type: DataTypes.STRING, require: true },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      allowNull: false,
      defaultValue: "customer",
    },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    sex: { type: DataTypes.ENUM("male", "female", "other"), allowNull: true },
    account_lock: { type: DataTypes.TINYINT, defaultValue: 0 },
  },
  { timestamps: false, tableName: "users" }
);

module.exports = UserModel;
