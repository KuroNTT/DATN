// const VariantSizeModel = require("../../models/VariantSize");

// exports.getStockByVariantAndSize = async (req, res) => {
//   try {
//     const { variantId, sizeId } = req.query;

//     if (!variantId || !sizeId) {
//       return res.status(400).json({ message: "Missing variantId or sizeId" });
//     }

//     const record = await VariantSizeModel.findOne({
//       where: {
//         variant_id: variantId,
//         size_id: sizeId,
//       },
//     });

//     if (!record) {
//       return res.status(404).json({ message: "Stock not found" });
//     }

//     return res.status(200).json({
//       variantId,
//       sizeId,
//       stock: record.stock,
//     });
//   } catch (error) {
//     console.error("Error fetching stock:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.decreaseStock = async (req, res) => {
//   const items = req.body;

//   if (!Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({ message: "Invalid or empty items array." });
//   }

//   const transaction = await VariantSizeModel.sequelize.transaction();

//   try {
//     for (const item of items) {
//       const { variantId, sizeId, quantity } = item;

//       const variantSize = await VariantSizeModel.findOne({
//         where: {
//           variant_id: variantId,
//           size_id: sizeId,
//         },
//         transaction,
//         lock: transaction.LOCK.UPDATE, // khóa row khi đọc
//       });

//       if (!variantSize) {
//         throw new Error(
//           `Variant size not found for variantId=${variantId} & sizeId=${sizeId}`
//         );
//       }

//       if (variantSize.stock < quantity) {
//         throw new Error(
//           `Not enough stock for variantId=${variantId} & sizeId=${sizeId}`
//         );
//       }

//       // Cập nhật tồn kho
//       variantSize.stock -= quantity;
//       await variantSize.save({ transaction });
//     }

//     await transaction.commit();
//     return res.status(200).json({ message: "Stock updated successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Failed to decrease stock:", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };


// test

exports.toggleWishlist = async (req, res) => {
  const user_id = req.user.id;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: "Thiếu product_id" });
  }

  try {
    const sequelize = require("../../config/sequelize");

    // Tìm variant_id tương ứng với product_id
    const [variantRow] = await sequelize.query(
      `SELECT id FROM product_variants WHERE product_id = ? LIMIT 1`,
      { replacements: [product_id] }
    );

    if (!variantRow.length) {
      return res.status(404).json({ message: "Không tìm thấy variant" });
    }

    const variant_id = variantRow[0].id;

    // Tìm trong wishlist
    const exists = await WishlistModel.findOne({
      where: { user_id, variant_id },
    });

    if (exists) {
      // Nếu đã có → xoá
      await WishlistModel.destroy({
        where: { user_id, variant_id },
      });
      return res.status(200).json({ message: "Đã xoá khỏi yêu thích" });
    }

    // Nếu chưa có → thêm mới
    await WishlistModel.create({
      user_id,
      variant_id,
      size: null, // hoặc 1 size mặc định nếu cần
      create_at: new Date(),
      is_active: 1,
    });

    res.status(201).json({ message: "Đã thêm vào yêu thích" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi toggle yêu thích" });
  }
};
