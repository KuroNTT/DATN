const express = require("express");
const router = express.Router();
<<<<<<< HEAD:backend/src/routes/product.routes.js
const productController = require("../controllers/product.controller");
const productAdminController = require ('../controllers/admin/product.controller');
const  auth = require('../middlewares/auth.middleware')
=======
const productController = require("../../controllers/user/product.controller");

>>>>>>> b84826bccefdf2d52142e9e059874d680678f8c2:backend/src/routes/user/product.routes.js
router.get("/", productController.getAllProducts);
router.get("/by-category/:id", productController.getProductByCategory);
router.get("/hot/:count", productController.getHotProducts);
router.get("/most-view/:count", productController.getMostViewed);
router.get("/new/:count", productController.getNewProducts);


router.get("/:slug", productController.getProductBySlug);

// CRUD
 router.post('/',  productAdminController.createProduct);
/*router.put('/:id', auth, productController.updateProduct); */
router.delete('/:id', auth, productAdminController.deleteProduct); 
router.patch('/:id/status',auth, productAdminController.updateStatus);
module.exports = router;
