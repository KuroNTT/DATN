const express = require("express");
const router = express.Router();
const ordersController = require("../../controllers/admin/order.controller");

router.get("/", ordersController.getAllOrder);
router.get("/:id", ordersController.getOrderById);
router.put("/:id/status", ordersController.updateOrderStatus);
router.put("/:id/note", ordersController.updateAdminNote);

module.exports = router;
