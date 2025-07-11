const OrderModel = require("../../models/Order");

const getAllOder = async (req, res) => {
  try {
    const orders = await OrderModel.findAll();
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi truy xuất đơn hàng" });
  }
};
module.exports = getAllOder;
