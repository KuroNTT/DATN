
// exports.toggleWishlist = async (req, res) => {
//   const user_id = req.user.id;
//   const { product_id } = req.body;

//   if (!product_id) {
//     return res.status(400).json({ message: "Thiếu product_id" });
//   }

//   try {
//     const sequelize = require("../../config/sequelize");

//     // Tìm variant_id tương ứng với product_id
//     const [variantRow] = await sequelize.query(
//       `SELECT id FROM product_variants WHERE product_id = ? LIMIT 1`,
//       { replacements: [product_id] }
//     );

//     if (!variantRow.length) {
//       return res.status(404).json({ message: "Không tìm thấy variant" });
//     }

//     const variant_id = variantRow[0].id;

//     // Tìm trong wishlist
//     const exists = await WishlistModel.findOne({
//       where: { user_id, variant_id },
//     });

//     if (exists) {
//       // Nếu đã có → xoá
//       await WishlistModel.destroy({
//         where: { user_id, variant_id },
//       });
//       return res.status(200).json({ message: "Đã xoá khỏi yêu thích" });
//     }

//     // Nếu chưa có → thêm mới
//     await WishlistModel.create({
//       user_id,
//       variant_id,
//       size: null, // hoặc 1 size mặc định nếu cần
//       create_at: new Date(),
//       is_active: 1,
//     });

//     res.status(201).json({ message: "Đã thêm vào yêu thích" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Lỗi server khi toggle yêu thích" });
//   }
// };

// test

const VariantSizeModel = require("../../models/VariantSize");
const WishlistModel = require("../../models/Wishlist");
const sequelize = require("../../config/sequelize");

/**
 * GET /api/stock?variantId=...&sizeId=...
 * Trả về tồn kho theo variant_id + size_id
 */
async function getStockByVariantAndSize(req, res) {
  try {
    const { variantId, sizeId } = req.query;

    if (!variantId || !sizeId) {
      return res.status(400).json({ message: "Missing variantId or sizeId" });
    }

    const record = await VariantSizeModel.findOne({
      where: {
        variant_id: variantId,
        size_id: sizeId,
      },
    });

    if (!record) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.status(200).json({
      variantId: Number(variantId),
      sizeId: Number(sizeId),
      stock: Number(record.stock),
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/stock/decrease
 * body: [{ variantId, sizeId, quantity }, ...]
 * Giảm tồn kho theo danh sách items (transaction + lock)
 */
async function decreaseStock(req, res) {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid or empty items array." });
  }

  const transaction = await sequelize.transaction(); // dùng instance chung

  try {
    for (const item of items) {
      const { variantId, sizeId, quantity } = item;

      if (!variantId || !sizeId || !quantity || quantity <= 0) {
        throw new Error(
          `Invalid item payload: variantId=${variantId}, sizeId=${sizeId}, quantity=${quantity}`
        );
      }

      const variantSize = await VariantSizeModel.findOne({
        where: { variant_id: variantId, size_id: sizeId },
        transaction,
        lock: true, // khóa row cho transaction hiện tại
      });

      if (!variantSize) {
        throw new Error(
          `Variant size not found for variantId=${variantId} & sizeId=${sizeId}`
        );
      }

      if (variantSize.stock < quantity) {
        throw new Error(
          `Not enough stock for variantId=${variantId} & sizeId=${sizeId}`
        );
      }

      variantSize.stock -= quantity;
      await variantSize.save({ transaction });
    }

    await transaction.commit();
    return res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Failed to decrease stock:", error.message);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * POST /api/wishlist/toggle
 * body: { product_id }
 * Yêu cầu: auth middleware đã gắn req.user.id
 */
async function toggleWishlist(req, res) {
  const user_id = req.user?.id;
  const { product_id } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "Chưa xác thực người dùng" });
  }
  if (!product_id) {
    return res.status(400).json({ message: "Thiếu product_id" });
  }

  try {
    // Tìm 1 variant thuộc product_id
    const [variantRow] = await sequelize.query(
      `SELECT id FROM product_variants WHERE product_id = ? LIMIT 1`,
      { replacements: [product_id] }
    );

    if (!variantRow.length) {
      return res.status(404).json({ message: "Không tìm thấy variant" });
    }

    const variant_id = variantRow[0].id;

    // Kiểm tra tồn tại trong wishlist
    const exists = await WishlistModel.findOne({
      where: { user_id, variant_id },
    });

    if (exists) {
      await WishlistModel.destroy({ where: { user_id, variant_id } });
      return res.status(200).json({ message: "Đã xoá khỏi yêu thích" });
    }

    await WishlistModel.create({
      user_id,
      variant_id,
      size: null, // nếu có quản lý size theo wishlist, chỉnh cho phù hợp
      create_at: new Date(), // kiểm tra tên cột (created_at vs create_at) cho đúng schema
      is_active: 1,
    });

    return res.status(201).json({ message: "Đã thêm vào yêu thích" });
  } catch (err) {
    console.error("toggleWishlist error:", err);
    return res.status(500).json({ message: "Lỗi server khi toggle yêu thích" });
  }
}

module.exports = {
  getStockByVariantAndSize,
  decreaseStock,
  toggleWishlist,
};
