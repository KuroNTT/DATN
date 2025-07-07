const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const  auth = require('../middlewares/auth.middleware')
router.get("/", productController.getAllProducts);
router.get("/by-category/:id", productController.getProductByCategory);
router.get("/hot/:count", productController.getHotProducts);
router.get("/most-view/:count", productController.getMostViewed);
router.get("/new/:count", productController.getNewProducts);


router.get("/:slug", productController.getProductBySlug);

// CRUD
/* router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct); */
router.delete('/:id', auth, productController.deleteProduct); 

module.exports = router;
