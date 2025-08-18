// const express = require("express");
// const router = express.Router();
// const VariantSizeController = require('../../controllers/user/variantSize.controller');


// router.get('/', VariantSizeController.getStockByVariantAndSize);
// module.exports = router;

const express = require("express");
const router = express.Router();
const VariantSizeController = require("../../controllers/user/variantSize.controller");

router.get("/", VariantSizeController.getStockByVariantAndSize);
router.post("/decrease", VariantSizeController.decreaseStock);

module.exports = router;

