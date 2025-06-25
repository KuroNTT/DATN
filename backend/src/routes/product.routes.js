const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.get("/", productController.getAllProducts);
router.get("/:slug", productController.getProductBySlug);
router.get("/by-category/:id", productController.getProductByCategory);
router.get("/hot/:count", productController.getHotProducts);
router.get("/most-view/:count", productController.getMostViewed);
router.get("/new/:count", productController.getNewProducts);

module.exports = router;
