const express = require("express");
const OrderController = require("../../controllers/user/orders.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

// router.get("/my", authMiddleware, OrderController.getOrdersByUser)
router.get("/", OrderController.getAllOrder);
router.get("/:id", OrderController.getOrderById);
router.post("/create-payment-link", OrderController.createPaymentLink);
router.post("/create-order", OrderController.saveOrder);
router.post("/callback/:orderCode", OrderController.callbackPayment);

module.exports = router;
