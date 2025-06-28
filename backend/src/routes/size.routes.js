const express = require("express");
const router = express.Router();
const sizeController = require("../controllers/size.controller");

router.get("/", sizeController.getAllSize);

module.exports = router;
