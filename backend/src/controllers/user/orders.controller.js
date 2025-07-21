const OrderModel = require("../../models/Order");
const VariantSizeModel = require("../../models/VariantSize");
const CartModel = require('../../models/cart');
const PayOS = require("@payos/node");
const payOS = new PayOS(
  "94bb561c-3489-4996-8497-3dcc01e85757",
  "abaa67a4-5049-49a1-a670-d0f49fa9893d",
  "eb024c2b666d386954855f9259b23635927a700226aa6d4b00fb5a74c20ffd7c"
);
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

const generateOrderCode = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  const timePart = Date.now().toString().slice(-4);
  return Number(`${timePart}${random}`); 
};


exports.createPaymentLink = async (req, res) => {
  try {
    let {
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

    if (
      !total_price ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Thiếu thông tin đơn hàng." });
    }

    voucherId = voucherId || null;
    customerNote = customerNote || "Không có ghi chú";
    adminNote = adminNote || null;

    let orderCode = generateOrderCode();
    let existingOrder = await OrderModel.findOne({
      where: { order_code: orderCode },
    });

    while (existingOrder) {
      orderCode = generateOrderCode();
      existingOrder = await OrderModel.findOne({
        where: { order_code: orderCode },
      });
    }

    const newOrder = await OrderModel.create({
      user_id: userId || null,
      order_code: orderCode,
      total_price,
      status: "pending",
      payment_id: paymentId,
      order_date: new Date(),
      voucher_id: voucherId,
      create_at: new Date(),
      customer,
      customer_address: address,
      customer_phone_number: phone,
      customer_note: customerNote,
      admin_note: adminNote,
    });

    const payload = {
      orderCode: orderCode,
      amount: Number(total_price),
      description: `đơn hàng ${orderCode}`,
      items,
      cancelUrl: `${process.env.DOMAIN}/cancel`,
      returnUrl: `${process.env.DOMAIN}/success`,
    };

    const paymentLinkResponse = await payOS.createPaymentLink(payload);

    if (!paymentLinkResponse?.checkoutUrl) {
      return res.status(500).json({
        error: "Không tạo được link thanh toán từ PayOS.",
      });
    }

    return res.status(200).json({
      success: true,
      orderCode,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo link thanh toán:", error);
    return res.status(500).json({
      error: "Lỗi máy chủ. Không tạo được link thanh toán.",
    });
  }
};

exports.callbackPayment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { orderCode } = req.params;
    const { cart } = req.body; // 👈 lấy từ FE nếu là khách
    
    const payRes = await payOS.getPaymentLinkInformation(Number(orderCode));
    const paymentStatus = payRes?.status || "NOT_FOUND";

    const order = await OrderModel.findOne({
      where: { order_code: Number(orderCode) },
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    if (paymentStatus === "PAID") {
      order.status = "paid";
      await order.save({ transaction });

      let cartItems = [];

      if (order.user_id) {
        // ✅ Trường hợp người dùng đã đăng nhập
        cartItems = await CartModel.findAll({
          where: { user_id: order.user_id },
          transaction,
        });
      } else if (Array.isArray(cart)) {
        // ✅ Trường hợp chưa đăng nhập: dùng giỏ hàng từ FE
        cartItems = cart.map(i=>({
          variant_id: i.variantId,
          size_id: i.sizeId
        })); // Không cần findAll
      } else {
        await transaction.rollback();
        return res.status(400).json({ error: "Thiếu thông tin giỏ hàng cho người dùng chưa đăng nhập." });
      }

      // ✅ Trừ stock
      for (const item of cartItems) {
        const variant = await VariantSizeModel.findOne({
          where: {
            variant_id: item.variant_id,
            size_id: item.size_id,
          },
          transaction,
        });

        if (!variant) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Không tìm thấy biến thể (variant_id=${item.variant_id}, size_id=${item.size_id}) trong kho.`,
          });
        }

        const quantity = item.quantity || 1;
        if (variant.stock < quantity) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Không đủ hàng (variant_id=${item.variant_id}, size_id=${item.size_id}).`,
          });
        }

        variant.stock -= quantity;
        await variant.save({ transaction });
      }

      // ✅ Nếu là user đăng nhập thì xóa giỏ hàng
      if (order.user_id) {
        await CartModel.destroy({
          where: { user_id: order.user_id },
          transaction,
        });
      }

    } else if (paymentStatus === "CANCELLED") {
      order.status = "cancelled";
      await order.save({ transaction });
    } else {
      order.status = "pending";
      await order.save({ transaction });
    }

    await transaction.commit();
    return res.status(200).json({
      success: true,
      orderCode,
      paymentStatus,
      message: "Đã kiểm tra và cập nhật trạng thái thanh toán.",
    });
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra trạng thái thanh toán:", error);
    await transaction.rollback();
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
};