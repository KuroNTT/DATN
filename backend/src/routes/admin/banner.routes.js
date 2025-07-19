const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/admin/banner.controller");

router.get("/", bannerController.getAllBanner);
router.post("/", bannerController.createBanner);
router.get("/:id", bannerController.getBannerById);
router.put("/:id", bannerController.updateBanner);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
