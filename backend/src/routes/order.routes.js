const express = require("express");
const oders = require("../controllers/orders.controller");
const router = express.Router();

router.get("/", oders.getAllOder);
router.get("/:id", oders.getOderById);

module.exports = router;
