const express = require("express");
const router = express.Router();
const wishlistController = require("../../controllers/user/wishlist.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

// Thêm
router.post("/", authMiddleware, wishlistController.addToWishlist);

// Lấy
router.get("/", authMiddleware, wishlistController.getWishlist);
router.get("/by-user", authMiddleware, wishlistController.getFavoritesByUser);

// Xoá theo wishlist_id
router.delete("/:wishlist_id", authMiddleware, wishlistController.removeFromWishlist);


module.exports = router;

