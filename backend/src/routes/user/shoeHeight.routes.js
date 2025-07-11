const express = require("express");
const router = express.Router();
const shoeHeightController = require("../../controllers/user/shoeHeight.controller");

router.get("/", shoeHeightController.getAllShoeHeight);

module.exports = router;
