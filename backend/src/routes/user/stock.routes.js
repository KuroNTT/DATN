const express = require("express");
const router = express.Router();
const VariantSizeController = require('../../controllers/user/variantSize.controller');

router.get('/', VariantSizeController.getStockByVariantAndSize);

module.exports = router;