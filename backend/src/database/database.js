const { timestamp } = require("rxjs");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("tvm_shoes", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
