
const WishlistModel = require("../../models/Wishlist");
const ProductVariantModel = require("../../models/ProductVariant");
const ProductModel = require("../../models/Product");
const ColorModel = require("../../models/Color");
const SizeModel = require("../../models/Size");


exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await WishlistModel.findAll({
            include: [
                {
                    model: ProductVariantModel,
                    as: "variant",
                    include: [
                        {
                            model: ProductModel,
                            as: "product",
                        },
                        {
                            model: ColorModel, as: "color",
                        },
                    ],
                },
                {
                    model: SizeModel,
                    as: "size_detail",
                },
            ],
            order: [["create_at", "DESC"]],
        });

        res.json(wishlists);
    } catch (error) {
        console.error("❌ Lỗi getAllWishlists:", error); // full stack
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};