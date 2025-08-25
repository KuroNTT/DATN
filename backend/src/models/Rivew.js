const ReviewModel = sequelize.define(
    "reviews",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        variant_id: { type: DataTypes.INTEGER, allowNull: false },
        comment: { type: DataTypes.TEXT, allowNull: false },
        rating: { type: DataTypes.INTEGER, allowNull: false },
        image: { type: DataTypes.TEXT, defaultValue: null },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { timestamps: false, tableName: "reviews" }
);

module.exports = ReviewModel;
