const express = require("express");
const router = express.Router();
const productAdminController = require ('../../controllers/admin/product.controller');
const  auth = require('../../middlewares/auth.middleware')

router.get("/", productAdminController.getAllProducts);

// CRUD
router.post('/',  productAdminController.createProduct);
router.delete('/:id', auth, productAdminController.deleteProduct); 
router.patch('/:id/status',auth, productAdminController.updateStatus);

//Edit
router.get('/slug/:slug', productAdminController.getProductBySlug);
router.put('/slug/:slug', productAdminController.updateProductBySlug);

module.exports = router;
