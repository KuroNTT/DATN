// const express = require("express");
// const router = express.Router();
// const productWishListController = require("../../controllers/admin/productWishList.controller");

// router.get("/", productWishListController.getAllWishlistsAdmin);
// // router.get("/", authMiddleware, wishlistController.getWishlist);
// module.exports = router;

const express = require("express");
const router = express.Router();
const WishlistModel = require("../../models/Wishlist");

// Lấy tất cả wishlist
router.get("/", async (req, res) => {
    try {
        const wishlist = await WishlistModel.findAll();
        res.json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
