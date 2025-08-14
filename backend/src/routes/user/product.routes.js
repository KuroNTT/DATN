const express = require("express");
const router = express.Router();
const productController = require("../../controllers/user/product.controller");

// chặn cache
function noCache(req, res, next) {
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
}


router.get("/new/:count", productController.getNewProducts);
router.get("/most-view/:count", productController.getMostViewed);
router.get("/by-category/:id", productController.getProductByCategory);
router.get("/hot/:count", productController.getHotProducts);
router.get("/:slug", productController.getProductBySlug);
router.get("/", productController.getAllProducts);

module.exports = router;
