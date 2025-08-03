const express = require("express");
const router = express.Router();
const vocherControllers = require('../../controllers/user/vocher.controller');

router.post('/verify', vocherControllers.verify);

module.exports = router;