const express = require("express");
const OrderController = require("../../controllers/user/orders.controller");
const router = express.Router();

router.get("/", OrderController.getAllOrder);
router.get("/:id", OrderController.getOrderById);
router.post("/create-payment-link", OrderController.createPaymentLink);
router.get("/callback/:orderCode",OrderController.callbackPayment);

module.exports = router;
