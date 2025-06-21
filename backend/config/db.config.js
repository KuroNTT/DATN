const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, { host: process.env.DB_HOST, dialect: "mysql" })
const UserModel = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, require: true },
    password: { type: DataTypes.STRING, require: true },
    name: { type: DataTypes.STRING, require: true },
    role: { type: DataTypes.ENUM('admin', 'customer'), allowNull: false, defaultValue: 'customer' },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    sex: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: true },
    account_lock: {type: DataTypes.TINYINT , defaultValue:0}
  },
  { timestamps: false,
     tableName: "users" }
);
module.exports = {
  UserModel
};
/* module.exports = sequelize; */