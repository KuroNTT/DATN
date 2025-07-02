const express = require("express");
const oders = require("../controllers/orders.controller");
const router = express.Router();

router.get("/", oders.getAllOder);
router.get("/:id", oders.getOderById);
router.post("/create-payment-link",oders.createPaymentLink)

module.exports = router;
