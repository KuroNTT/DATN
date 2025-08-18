const express = require("express");
const router = express.Router();
const voucherControllers = require('../../controllers/user/voucher.controller');

router.post('/verify', voucherControllers.verify);
router.get('/', voucherControllers.getAllVouchers);
router.get('/:id', voucherControllers.getVoucherById);
router.post('/', voucherControllers.createVoucher);
router.put('/update/:id', voucherControllers.updateVoucher);
router.delete('/:id',voucherControllers.deleteVoucher)


module.exports = router;