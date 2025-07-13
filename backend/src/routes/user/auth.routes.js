const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user/auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/verify-email", authController.verifyEmail);
// Lấy thông tin người dùng
router.get("/me", authMiddleware, authController.getProfile);
// Cập nhật thông tin người dùng
router.put("/me", authMiddleware, authController.updateProfile);
router.post("/profile/change-pw", authController.changePw);
router.post("/forgot-pw", authController.forgotPw);
router.post("/reset-pw", authController.resetPw);
module.exports = router;
