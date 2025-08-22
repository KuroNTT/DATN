const OrderModel = require("../../models/Order");
const OrderDetailModel = require("../../models/Order-detail");
const ProductVariantModel = require("../../models/ProductVariant");
const ProductModel = require("../../models/Product");
const SizeModel = require("../../models/Size");
const VariantSizeModel = require("../../models/VariantSize");
const CartModel = require("../../models/cart");
const VoucherModel = require("../../models/voucher");
const PayOS = require("@payos/node");
const payOS = new PayOS(
  "94bb561c-3489-4996-8497-3dcc01e85757",
  "abaa67a4-5049-49a1-a670-d0f49fa9893d",
  "eb024c2b666d386954855f9259b23635927a700226aa6d4b00fb5a74c20ffd7c"
);
const sequelize = require("../../config/sequelize");

async function snapshotOrderDetailsFromCart(userId, orderId, transaction) {
  const cartItems = await CartModel.findAll({
    where: { user_id: userId },
    transaction,
  });

  if (!cartItems.length) {
    throw new Error("Giỏ hàng trống.");
  }

  let totalPrice = 0;
  const payItems = [];

  for (const ci of cartItems) {
    if (!ci.variant_id || !ci.size_id) {
      throw new Error(`Giỏ hàng thiếu variant_id/size_id (row id=${ci.id})`);
    }

    const variant = await ProductVariantModel.findByPk(ci.variant_id, {
      include: [
        { model: ProductModel, as: "product" },
        {
          model: VariantSizeModel,
          as: "product_variant_sizes",
          include: [{ model: SizeModel, as: "size" }],
        },
      ],
      transaction,
    });

    if (!variant) throw new Error(`Không tìm thấy variant #${ci.variant_id}`);
    const product = variant.product;
    const sizeObj = variant.product_variant_sizes?.find(
      (s) => s.size.id === ci.size_id
    );
    if (!sizeObj) {
      throw new Error(
        `Không tìm thấy size_id=${ci.size_id} thuộc variant_id=${ci.variant_id}`
      );
    }

    const unitPrice =
      product.price_sale != null
        ? Number(product.price_sale)
        : Number(product.price);
    const qty = Number(ci.quantity) || 1;

    totalPrice += unitPrice * qty;

    await OrderDetailModel.create(
      {
        order_id: orderId,
        variant_id: ci.variant_id,
        size_id: ci.size_id,
        product_name: product.name,
        variant_name: variant.color_name ?? null,
        size_value: sizeObj.size.size,
        price: unitPrice,
        quantity: qty,
      },
      { transaction }
    );

    // Dùng cho PayOS items
    payItems.push({
      name: `${product.name} - Size ${sizeObj.size.size}`,
      quantity: qty,
      price: unitPrice, // đơn giá
    });
  }

  return { totalPrice, payItems };
}

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await OrderModel.findAll();
    res.json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi truy xuất đơn hàng" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderModel.findByPk(orderId, {
      attributes: [
        "id",
        "order_code",
        "status",
        "create_at",
        "total_price",
        "payment_method",
        "customer",
        "customer_address",
        "customer_phone_number",
        "customer_note",
        "admin_note",
        "order_date",
      ],
      include: [
        {
          model: OrderDetailModel,
          as: "order_details",
          attributes: [
            "product_name",
            "variant_name",
            "size_value",
            "price_at_order",
            "quantity",
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    return res.status(200).json(order);
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

    if (!userId) {
      return res.status(400).json({ error: "Thiếu userId." });
    }

    // --- Voucher ---
    if (voucherCode) {
      const voucher = await VoucherModel.findOne({
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
      user_id: userId,
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
      let size = await SizeModel.findByPk(item.sizeId);
      await OrderDetailModel.create(
        {
          order_id: newOrder.id,
          variant_id: item.variantId,
          quantity: item.quantity || 1,
          price: item.price || 0,
          product_name: item.product_name,
          size_id: item.sizeId,
          variant_name: item.variant_name,
          size_value: size.size
        }
      );
    }

    
    items = items.map(e=>({name: e.name, price: e.price, quantity: e.quantity}));

    const payload = {
      orderCode: orderCode,
      amount: Number(total_price),
      description: `DON HANG ${orderCode}`,
      items,
      cancelUrl: `${process.env.DOMAIN}/cancel`,
      returnUrl: `${process.env.DOMAIN}/success`,
    };

    const paymentLinkResponse = await payOS.createPaymentLink(payload);

    if (!paymentLinkResponse?.checkoutUrl) {
      return res
        .status(500)
        .json({ error: "Không tạo được link thanh toán từ PayOS." });
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

    const payRes = await payOS.getPaymentLinkInformation(Number(orderCode));
    const paymentStatus = payRes?.status || "NOT_FOUND";

    const order = await OrderModel.findOne({
      where: { order_code: Number(orderCode) },
      include: [
        {
          model: OrderDetailModel,
          as: "order_details",
        },
      ],
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    if (paymentStatus === "PAID") {
      order.status = "paid";
      await order.save({ transaction });

      // --- Trừ stock dựa vào order_details ---
      for (const detail of order.order_details) {
        const variantSize = await VariantSizeModel.findOne({
          where: {
            variant_id: detail.variant_id,
            size_id: detail.size_id,
          },
          transaction,
        });

        if (!variantSize) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Không tìm thấy biến thể (variant_id=${detail.variant_id}, size_id=${detail.size_id}) trong kho.`,
          });
        }

        if (variantSize.stock < detail.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Không đủ hàng (variant_id=${detail.variant_id}, size_id=${detail.size_id}).`,
          });
        }

        variantSize.stock -= detail.quantity;
        await variantSize.save({ transaction });
      }

      // --- Xoá giỏ hàng của user sau khi thanh toán ---
      if (order.user_id) {
        await CartModel.destroy({
          where: { user_id: order.user_id },
          transaction,
        });
      }

      // --- Trừ voucher nếu có ---
      if (order.voucher_id) {
        const voucher = await VoucherModel.findByPk(order.voucher_id, {
          transaction,
        });
        if (voucher) {
          voucher.quantity--;
          await voucher.save({ transaction });
        }
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

    // --- Xử lý voucher ---
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

    // --- Sinh order_code unique ---
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

    // --- Tạo Order ---
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

    // --- Snapshot chi tiết sản phẩm ---
    for (const item of items) {
      if (!item.variantId || !item.sizeId) {
        console.warn("⚠️ Bỏ qua sản phẩm thiếu variantId hoặc sizeId:", item);
        continue;
      }

      const variant = await ProductVariantModel.findByPk(item.variantId, {
        include: [
          { model: ProductModel, as: "product" },
          {
            model: VariantSizeModel,
            as: "product_variant_sizes",
            include: [{ model: SizeModel, as: "size" }],
          },
        ],
        transaction,
      });

      if (!variant) throw new Error("Không tìm thấy variant");

      const product = variant.product;
      const sizeObj = variant.product_variant_sizes.find(
        (s) => s.size.id === item.sizeId
      );
      if (!sizeObj) throw new Error("Không tìm thấy size cho variant này");

      const price = product.price_sale ?? product.price;

      await OrderDetailModel.create(
        {
          order_id: newOrder.id,
          variant_id: variant.id,
          size_id: item.sizeId,
          product_name: product.name,
          variant_name: variant.color_name ?? null,
          size_value: sizeObj.size.size,
          price: item.price ?? 0,
          product_name: item.product_name ?? "Sản phẩm",
          variant_name: item.variant_name ?? "Default Variant",
          quantity: item.quantity || 1,
        },
        { transaction }
      );
    }

    // --- Dọn giỏ hàng ---
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
