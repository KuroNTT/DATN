const CartModel = require("../models/cart");
const ProductVariantModel = require("../models/ProductVariant");
const ProductModel = require("../models/Product");

const addToCart = async (req, res) => {
  const { userId, variantId, sizeId, quantity } = req.body;

  // ✅ Kiểm tra thiếu field (nên dùng || chứ không phải &&)
  if (!userId || !variantId || !sizeId || !quantity) {
    return res.status(400).json({ error: "Thiếu field" });
  }

  try {
    const existingItem = await CartModel.findOne({
      where: {
        user_id: userId,
        variant_id: variantId,
        size_id: sizeId,
      },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res
        .status(200)
        .json({ success: true, message: "Đã cập nhật số lượng sản phẩm." });
    } else {
      await CartModel.create({
        user_id: userId,
        variant_id: variantId,
        size_id: sizeId,
        quantity: quantity,
      });
      return res
        .status(201)
        .json({ success: true, message: "Đã thêm sản phẩm vào giỏ hàng." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
};

const deleteItemById = async (req, res) => {
  const { userId, variantId, sizeId } = req.params;
  if (!userId || !variantId || !sizeId) {
    return res.status(400).json({ error: "Thiếu thông tin để xóa." });
  }

  try {
    const deletedCount = await CartModel.destroy({
      where: {
        user_id: userId,
        variant_id: variantId,
        size_id: sizeId,
      },
    });
    if (deletedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng." });
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy sản phẩm trong giỏ.",
        });
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
};

const getAllCart = async (req, res) => {
  try {
    const cartItems = await CartModel.findAll({
      where: { user_id: req.params.userId },
      include: [
        {
          model: ProductVariantModel,
          as: "variant",
          attributes: ["id", "image_url"],
          include: [
            {
              model: ProductModel,
              as: "product",
              attributes: ["name", "price", "description", "image"],
            },
          ],
        },
      ],
    });

    res.json(cartItems);
  } catch (err) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateCartQuantity = async (req, res) => {
  const { userId, variantId, sizeId, quantity } = req.body;
  if (!userId || !variantId || !sizeId || quantity == null) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết." });
  }
  if (quantity < 1) {
    return res.status(400).json({ error: "Số lượng phải >= 1" });
  }
  try {
    const item = await CartModel.findOne({
      where: {
        user_id: userId,
        variant_id: variantId,
        size_id: sizeId
      }
    });

    if (!item) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm trong giỏ." });
    }

    item.quantity = quantity;
    await item.save();
    return res.status(200).json({ success: true, message: "Đã cập nhật số lượng thành công." });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
};
module.exports = {
  addToCart,
  getAllCart,
  deleteItemById,
};
