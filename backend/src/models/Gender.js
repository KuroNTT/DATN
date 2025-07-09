const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");


const GenderModel = sequelize.define(
    "genders",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        slug: { type: DataTypes.STRING },
    },
    { timestamps: false, tableName: "genders" }
);

module.exports = GenderModel;
