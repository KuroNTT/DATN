// const WishlistModel = require("../../models/Wishlist");
// const ProductVariantModel = require("../../models/ProductVariant");
// const ProductModel = require("../../models/Product");
// const ColorModel = require("../../models/Color");

// exports.getAllWishlists = async (req, res) => {
//     try {
//         const wishlists = await WishlistModel.findAll({
//             attributes: ["id", "user_id", "variant_id", "size", "create_at", "is_active"],
//             include: [
//                 {
//                     model: ProductVariantModel,
//                     as: "variant", // 👈 alias đúng như associations
//                     attributes: ["id", "product_id", "color_id", "image_url"],
//                     include: [
//                         {
//                             model: ProductModel,
//                             as: "product",
//                             attributes: ["id", "name", "price_sale", "image"],
//                         },
//                         {
//                             model: ColorModel,
//                             as: "color",
//                             attributes: ["id", "name", "code"],
//                         },
//                     ],
//                 },
//             ],
//             order: [["create_at", "DESC"]],
//         });

//         res.json(wishlists);
//     } catch (error) {
//         console.error("❌ Lỗi khi lấy wishlist:", error);
//         res.status(500).json({ message: "Lỗi server" });
//     }
// };

require("../../models/associations");
const WishlistModel = require("../../models/Wishlist");
const ProductVariantModel = require("../../models/ProductVariant");
const ProductModel = require("../../models/Product");
const ColorModel = require("../../models/Color");

exports.getAllWishlistsAdmin = async (req, res) => {
    try {
        const wishlists = await WishlistModel.findAll({
            attributes: ["id", "user_id", "variant_id", "size", "create_at", "is_active"],
            include: [
                {
                    model: ProductVariantModel,
                    as: "variant",
                    attributes: ["id", "product_id", "color_id", "image_url"],
                    include: [
                        {
                            model: ProductModel,
                            as: "product",
                            attributes: ["id", "name", "price_sale", "image"],
                        },
                        {
                            model: ColorModel,
                            as: "color",
                            attributes: ["id", "name", "code"],
                        },
                    ],
                },
            ],
            order: [["create_at", "DESC"]],
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy wishlist admin:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
