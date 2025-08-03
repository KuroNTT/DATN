const VoucherModel = require("../../models/voucher");

exports.verify = async (req, res) => {
  const { code, orderTotal } = req.body;

  if (!code || orderTotal == null) {
    return res
      .status(400)
      .json({ message: "Thiếu mã voucher hoặc tổng đơn hàng" });
  }

  try {
    const voucher = await VoucherModel.findOne({
      where: { code, is_active: true },
    });

    if (!voucher) {
      return res.status(404).json({
        status: "invalid",
        message: "Voucher không tồn tại hoặc đã bị vô hiệu hóa",
      });
    }

    const now = new Date();
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);

    if (now < startDate || now > endDate) {
      return res.status(400).json({
        status: "expired",
        message: "Voucher đã hết hạn hoặc chưa bắt đầu",
      });
    }

    if (voucher.quantity <= 0) {
      return res.status(400).json({
        status: "used-up",
        message: "Voucher đã hết lượt sử dụng",
      });
    }

    const total = parseFloat(orderTotal);
    const min = parseFloat(voucher.min_order_value || 0);

    if (total < min) {
      return res.status(400).json({
        status: "min-not-met",
        message: `Đơn hàng cần tối thiểu ${min}đ để dùng voucher này`,
        minOrderValue: min,
      });
    }

    // Tính giảm giá
    let discountAmount = 0;
    if (voucher.discount_type === "percent") {
      discountAmount = (total * parseFloat(voucher.discount_value)) / 100;
    } else {
      discountAmount = parseFloat(voucher.discount_value);
    }

    return res.status(200).json({
      status: "valid",
      discountType: voucher.discount_type,
      discountValue: parseFloat(voucher.discount_value),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      minOrderValue: min,
      message: "Áp mã thành công",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Lỗi server" });
  }
};
