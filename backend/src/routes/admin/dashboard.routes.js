const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboard.controller");

router.get("/blogs", dashboardController.getAllBlogs);
router.get("/products", dashboardController.getNewProducts);
router.get("/low-stock", dashboardController.getLowStockProducts);

router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
