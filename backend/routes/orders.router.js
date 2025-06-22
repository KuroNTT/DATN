const express = require('express');
const getAllOder = require('../controllers/orders.controller');
const router = express.Router();

router.get('/',getAllOder);

module.exports = router;