const OrderModel = require("../../models/Order");
const PayOS = require("@payos/node");
const payOS = new PayOS(
  "94bb561c-3489-4996-8497-3dcc01e85757",
  "abaa67a4-5049-49a1-a670-d0f49fa9893d",
  "eb024c2b666d386954855f9259b23635927a700226aa6d4b00fb5a74c20ffd7c"
);

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

exports.createPaymentLink = async (req, res) => {
  let {
    orderCode,
    total_price,
    items,
    userId,
    paymentId,
    voucherId,
    customer,
    address,
    phone,
    customerNote,
    adminNote,
  } = req.body;
  voucherId = voucherId || null;
  customerNote = customerNote || "không có ghi chú";
  adminNote = adminNote || null;
  let payload = {
    orderCode: Number(orderCode),
    amount: Number(total_price),
    description: `Đơn hàng: ${orderCode}`,
    items,
    cancelUrl: `${process.env.DOMAIN}/cancel`,
    returnUrl: `${process.env.DOMAIN}/success`,
  };
  try {
    // if(paymentId==){}
    OrderModel.create({
      user_id: userId,
      total_price,
      status: "pending", // ví dụ: pending / paid / canceled
      payment_id: paymentId,
      order_date: new Date(),
      voucher_id: voucherId,
      create_at: new Date(),
      customer,
      customer_address: address,
      customer_phone_number: phone,
      customer_note: customerNote,
      admin_note: null,
    });
    const paymentLinkResponse = await payOS.createPaymentLink(payload);
    res.json({ checkoutUrl: paymentLinkResponse.checkoutUrl });
    return;
  } catch (error) {
    console.error(error);
    res.send("Something went error");
    return;
  }
};
