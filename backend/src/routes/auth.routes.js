const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middlewares/auth.middleware');

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/verify-email", authController.verifyEmail);
// Lấy thông tin người dùng
router.get('/me', authMiddleware, authController.getProfile);
// Cập nhật thông tin người dùng
router.put('/me', authMiddleware, authController.updateProfile);

module.exports = router;