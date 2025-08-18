const express = require("express");
const router = express.Router();
const productController = require("../../controllers/user/product.controller");

router.get("/", productController.getAllProducts);
router.get("/by-category/:id", productController.getProductByCategory);
router.get("/category/:slug", productController.getProductsByCategorySlug);
router.get("/hot/:count", productController.getHotProducts);
router.get("/most-view/:count", productController.getMostViewed);
router.get("/new/:count", productController.getNewProducts);
router.get("/:slug", productController.getProductBySlug);

module.exports = router;
