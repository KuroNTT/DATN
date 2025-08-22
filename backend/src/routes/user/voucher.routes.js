const express = require("express");
const router = express.Router();
const voucherControllers = require('../../controllers/user/voucher.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
router.post('/verify', voucherControllers.verify);
router.get('/', voucherControllers.getAllVouchers);
router.get('/:id', voucherControllers.getVoucherById);
router.post('/', voucherControllers.createVoucher);
router.put('/update/:id', voucherControllers.updateVoucher);
router.delete('/:id',voucherControllers.deleteVoucher)

router.post('/save', authMiddleware, voucherControllers.saveVoucher);
router.get('/me', authMiddleware, voucherControllers.getUserVouchers);
module.exports = router;