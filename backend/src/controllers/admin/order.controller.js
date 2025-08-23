const OrderModel = require("../../models/Order");
const OrderDetailModel = require("../../models/Order-detail");
const UserModel = require("../../models/User");
const VoucherModel = require("../../models/voucher");
const sequelize = require("../../config/sequelize");

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await OrderModel.findAll();
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi truy xuất đơn hàng" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await OrderModel.findByPk(orderId);
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi truy xuất đơn hàng" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findByPk(id, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    if (["completed", "cancelled"].includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Đơn hàng đã kết thúc, không thể thay đổi trạng thái.",
      });
    }

    order.status = status;
    await order.save({ transaction });

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công.",
      order,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Lỗi cập nhật trạng thái đơn hàng:", error);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi cập nhật trạng thái đơn hàng." });
  }
};

exports.updateAdminNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const order = await OrderModel.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    order.admin_note = adminNote || null;
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Đã cập nhật ghi chú admin.", order });
  } catch (error) {
    console.error("❌ Lỗi cập nhật ghi chú admin:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật ghi chú admin." });
  }
};
