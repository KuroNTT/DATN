const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const PriceRangeModel = sequelize.define(
    "price_ranges",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING },
        max: { type: DataTypes.INTEGER },
        min: { type: DataTypes.INTEGER },
    },
    {
        timestamps: false,
        tableName: "price_ranges",
    }
);

module.exports = PriceRangeModel;
