const CartModel = require("../../models/cart");
const ProductVariantModel = require("../../models/ProductVariant");
const ProductModel = require("../../models/Product");
const SizeModel = require("../../models/Size");
const CategoryModel = require("../../models/Category");

exports.addToCart = async (req, res) => {
  const { userId, variantId, sizeId, quantity } = req.body;

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

exports.deleteItemById = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ.",
      });
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
};

exports.getAllCart = async (req, res) => {
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
              attributes: [
                "name",
                "price",
                "price_sale",
                "description",
                "image",
              ],
              include: [
                {
                  model: CategoryModel,
                  as: "category",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
        {
          model: SizeModel,
          as: "size",
          attributes: ["id", "size"],
        },
      ],
    });

    return res.json(cartItems);
  } catch (err) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateCartQuantity = async (req, res) => {
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
        size_id: sizeId,
      },
    });

    if (!item) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy sản phẩm trong giỏ." });
    }

    item.quantity = quantity;
    await item.save();
    return res
      .status(200)
      .json({ success: true, message: "Đã cập nhật số lượng thành công." });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
};

exports.getAllCartLocalStore = async (req, res) => {
  try {
    const { items } = req.body;

    // Lấy danh sách variantIds và sizeIds
    const variantIds = items.map((item) => item.variantId);
    const sizeIds = items.map((item) => item.sizeId);

    // Lấy thông tin các variant và include product
    const variants = await ProductVariantModel.findAll({
      where: { id: variantIds },
      include: [
        {
          model: ProductModel,
          as: "product",
          attributes: ["id", "name", "price", "image", "price_sale"],
          include: [
            {
              model: CategoryModel,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    // Lấy thông tin size
    const sizes = await SizeModel.findAll({
      where: { id: sizeIds },
    });

    // Gộp lại dữ liệu theo từng item
    const response = items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      const size = sizes.find((s) => s.id === item.sizeId);
      return {
        variantId: item.variantId,
        sizeId: item.sizeId,
        quantity: item.quantity,
        variant,
        size,
      };
    });

    return res.json(response);
  } catch (error) {
    console.error("❌ Error in getAllCartLocalStore:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
