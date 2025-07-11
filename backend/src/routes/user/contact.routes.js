const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/user/contact.controller");

router.post("/", contactController.sendMailToAdmin);

module.exports = router;
