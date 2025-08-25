const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

// Model mô tả bảng Wishlist
const WishlistModel = sequelize.define(
    "product_wish_list",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        // variant_id: { type: DataTypes.INTEGER },
        variant_id: { type: DataTypes.INTEGER, field: 'variant_id' },
        size: { type: DataTypes.INTEGER },
        create_at: { type: DataTypes.DATE },
        is_active: { type: DataTypes.BOOLEAN },
    },
    { timestamps: false, tableName: "product_wish_list" }
);

module.exports = WishlistModel;
