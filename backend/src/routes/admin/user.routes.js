const express = require("express");
const router = express.Router();
const {
  softDeleteUser,
  toggleLockUser,
  changeUserRole,
  resendVerify,
  getAllUsers
} = require("../../controllers/admin/user.controller");
router.get("/", getAllUsers);
router.delete("/:id", softDeleteUser);
router.patch("/:id/lock", toggleLockUser);
router.patch("/:id/role", changeUserRole);
router.post("/auth/resend-verify", resendVerify);

module.exports = router;
