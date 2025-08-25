
const express = require("express");
const router = express.Router();
const WishlistModel = require("../../models/Wishlist");
const wishListController = require("../../controllers/admin/productWishList.controller")
// Lấy tất cả wishlist
router.get("/", wishListController.getAllWishlists);

module.exports = router;
