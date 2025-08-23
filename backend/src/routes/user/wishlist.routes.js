const express = require("express");
const router = express.Router();
const wishlistController = require("../../controllers/user/wishlist.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/", authMiddleware, wishlistController.addToWishlist);
router.get("/", authMiddleware, wishlistController.getWishlist);
router.get("/by-user", authMiddleware, wishlistController.getFavoritesByUser);
router.delete(
  "/:variant_id",
  authMiddleware,
  wishlistController.removeFromWishlist
);

module.exports = router;
