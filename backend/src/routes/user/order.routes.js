const express = require("express");
const getAllOder = require("../../controllers/user/orders.controller");
const router = express.Router();

router.get("/", getAllOder);

module.exports = router;
