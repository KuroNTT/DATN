const OrderModel = require("../../models/Order");
const VariantSizeModel = require("../../models/VariantSize");
const CartModel = require("../../models/cart");
const VoucherModel = require("../../models/voucher");
const PayOS = require("@payos/node");
const OrderDetailModel = require("../../models/Order-detail");
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
      payment_method,
      voucherId,
      customer,
      address,
      phone,
      customerNote,
      adminNote,
      voucherCode,
    } = req.body;

    if (!total_price || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Thiếu thông tin đơn hàng." });
    }

    if (voucherCode) {
      let voucher = await VoucherModel.findOne({
        where: { code: voucherCode },
      });
      voucherId = voucher.id;
    } else {
      voucherId = null;
    }
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
      payment_method,
      order_date: new Date(),
      voucher_id: voucherId,
      create_at: new Date(),
      customer,
      customer_address: address,
      customer_phone_number: phone,
      customer_note: customerNote,
      admin_note: adminNote,
    });
    console.log(items);

    for (const item of items) {
      if (!item.variantId) {
        console.warn("⚠️ Bỏ qua sản phẩm thiếu variantId:", item);
        continue; // bỏ qua item này, không lưu vào order_detail
      }

      await OrderDetailModel.create(
        {
          order_id: newOrder.id,
          variant_id: item.variantId,
          quantity: item.quantity || 1,
          price: item.price || 0,
        }
      );
    }
    const payload = {
      orderCode: orderCode,
      amount: Number(total_price),
      description: `DON HANG ${orderCode}`,
      items: items.map((e) => ({
        name: e.name,
        quantity: e.quantity,
        price: e.price,
      })),
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
    const { cart } = req.body;

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
        cartItems = await CartModel.findAll({
          where: { user_id: order.user_id },
          transaction,
        });
      } else if (Array.isArray(cart)) {
        cartItems = cart.map((i) => ({
          variant_id: i.variantId,
          size_id: i.sizeId,
        }));
      } else {
        await transaction.rollback();
        return res.status(400).json({
          error: "Thiếu thông tin giỏ hàng cho người dùng chưa đăng nhập.",
        });
      }

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

      if (order.user_id) {
        await CartModel.destroy({
          where: { user_id: order.user_id },
          transaction,
        });
      }
      if (order.voucher_id) {
        let voucher = await VoucherModel.findByPk(order.voucher_id);
        voucher.quantity--;
        voucher.save();
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

exports.saveOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      items,
      userId,
      total_price,
      customer,
      address,
      phone,
      customerNote,
      adminNote,
      voucherCode,
      payment_method,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Thiếu thông tin sản phẩm trong đơn hàng." });
    }

    let voucherId = null;
    if (voucherCode) {
      const voucher = await VoucherModel.findOne({
        where: { code: voucherCode },
        transaction,
      });
      if (!voucher) {
        await transaction.rollback();
        return res.status(400).json({ error: "Voucher không tồn tại." });
      }
      if (voucher.quantity <= 0) {
        await transaction.rollback();
        return res.status(400).json({ error: "Voucher đã hết lượt sử dụng." });
      }
      voucherId = voucher.id;
      voucher.quantity--;
      await voucher.save({ transaction });
    }

    let orderCode;
    let existingOrder;
    do {
      orderCode = Number(
        `${Date.now().toString().slice(-4)}${Math.floor(
          100000 + Math.random() * 900000
        )}`
      );
      existingOrder = await OrderModel.findOne({
        where: { order_code: orderCode },
        transaction,
      });
    } while (existingOrder);

    const newOrder = await OrderModel.create(
      {
        user_id: userId || null,
        total_price,
        status: "pending",
        payment_method,
        order_date: new Date(),
        voucher_id: voucherId,
        create_at: new Date(),
        customer,
        customer_address: address,
        customer_phone_number: phone,
        customer_note: customerNote || "Không có ghi chú",
        admin_note: adminNote || null,
        order_code: orderCode,
      },
      { transaction }
    );
    console.log(items);

    for (const item of items) {
      if (!item.variantId) {
        console.warn("⚠️ Bỏ qua sản phẩm thiếu variantId:", item);
        continue; // bỏ qua item này, không lưu vào order_detail
      }

      await OrderDetailModel.create(
        {
          order_id: newOrder.id,
          variant_id: item.variantId,
          quantity: item.quantity || 1,
          price: item.price || 0,
        },
        { transaction }
      );
    }

    if (userId) {
      await CartModel.destroy({
        where: { user_id: userId },
        transaction,
      });
    }

    await transaction.commit();
    return res.status(200).json({ success: true, order: newOrder });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Lỗi lưu đơn hàng:", error);
    return res.status(500).json({ error: "Lỗi máy chủ khi lưu đơn hàng." });
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    const { status, customerNote, orderId } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await OrderModel.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (customerNote !== undefined) {
      order.customer_note = customerNote;
    }

    await order.save();

    return res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};