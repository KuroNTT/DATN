const express = require("express");
const router = express.Router();
const colorController = require("../../controllers/user/color.controller");

router.get("/", colorController.getAllColors);

module.exports = router;
