const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/user/cart.controller");

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getAllCart);
router.post("/", cartController.getAllCartLocalStore);
router.delete("/:userId/:variantId/:sizeId", cartController.deleteItemById);
router.put("/update-cart", cartController.updateCartQuantity);

module.exports = router;
