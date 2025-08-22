const VoucherModel = require("../../models/voucher");
const VoucherUserModel = require("../../models/vocherUser")
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

exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await VoucherModel.findAll();
    res.json(vouchers);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách voucher:", error);
    res.status(500).json({ error: "Không thể lấy danh sách voucher" });
  }
};

exports.getVoucherById = async (req, res) => {
  try {
    const id = req.params.id;
    const voucher = await VoucherModel.findByPk(id);

    if (!voucher) {
      return res.status(404).json({ error: "Không tìm thấy voucher" });
    }

    res.json(voucher);
  } catch (error) {
    console.error("❌ Lỗi khi lấy voucher:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy voucher" });
  }
};

exports.createVoucher = async (req, res) => {
  try {
    const newVoucher = await VoucherModel.create(req.body);
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error("❌ Lỗi khi tạo voucher:", error);
    res.status(400).json({ error: "Dữ liệu không hợp lệ hoặc thiếu thông tin" });
  }
};

exports.updateVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const voucher = await VoucherModel.findByPk(id);

    if (!voucher) {
      return res.status(404).json({ error: "Không tìm thấy voucher" });
    }

    await voucher.update(req.body);
    res.json(voucher);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật voucher:", error);
    res.status(400).json({ error: "Cập nhật không thành công" });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const voucher = await VoucherModel.findByPk(id);

    if (!voucher) {
      return res.status(404).json({ error: "Không tìm thấy voucher" });
    }

    await voucher.destroy();
    res.json({ message: "Đã xoá voucher thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xoá voucher:", error);
    res.status(500).json({ error: "Xoá không thành công" });
  }
};
// Lưu voucher cho user
exports.saveVoucher = async (req, res) => {
  try {
    const user_id = req.user.id;      
    const { voucher_id } = req.body;  

    if (!voucher_id) {
      return res.status(400).json({ error: "Chưa truyền voucher_id" });
    }

    const voucher = await VoucherModel.findByPk(voucher_id);
    if (!voucher) {
      return res.status(404).json({ error: "Voucher không tồn tại" });
    }

    const [record, created] = await VoucherUserModel.findOrCreate({
      where: { user_id, voucher_id },
      defaults: { used_at: false, status: true }
    });

    if (!created) {
      return res.status(400).json({ message: "Voucher đã lưu trước đó" });
    }

    res.json({ message: "Đã lưu voucher thành công" });
  } catch (error) {
    console.error("Lỗi khi lưu voucher:", error);
    res.status(500).json({ error: "Lưu voucher không thành công" });
  }
};
exports.getUserVouchers = async (req, res) => {
  try {
    const user_id = req.user.id;

    const vouchers = await VoucherUserModel.findAll({
      where: { user_id },
      include: [
        {
          model: VoucherModel,
          attributes: ['id', 'code', 'discount_value', 'end_date']
        }
      ],
      order: [['saved_at', 'DESC']]
    });

    res.json({ data: vouchers });
  } catch (err) {
    console.error('Lỗi load voucher:', err);
    res.status(500).json({ error: 'Load voucher không thành công' });
  }
};