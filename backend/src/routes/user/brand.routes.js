const express = require("express");
const router = express.Router();
const brandController = require("../../controllers/user/brand.controller");

router.get("/", brandController.getAllBrands);

module.exports = router;
