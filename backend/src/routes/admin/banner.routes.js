const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/user/banner.controller");

router.get("/", bannerController.getAllBanner);

module.exports = router;
