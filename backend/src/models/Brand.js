const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

//Model mô tả bảng brands
const BrandsModel = sequelize.define(
    "brands",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        slug: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING, allowNull: false },
        sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
        status: { type: DataTypes.INTEGER, defaultValue: 0 },
        created_at: { type: DataTypes.DATE },
        update_at: { type: DataTypes.DATE },
    },
    { timestamps: false, tableName: "brands" }
);

module.exports = BrandsModel;
