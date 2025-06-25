const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/add',cartController.addToCart);
router.get('/:userId',cartController.getAllCart);

module.exports = router;