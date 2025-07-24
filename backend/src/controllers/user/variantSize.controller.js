const VariantSizeModel = require("../../models/VariantSize");

exports.getStockByVariantAndSize = async (req, res) => {
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
      variantId,
      sizeId,
      stock: record.stock,
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.decreaseStock = async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid or empty items array." });
  }

  const transaction = await VariantSizeModel.sequelize.transaction();

  try {
    for (const item of items) {
      const { variantId, sizeId, quantity } = item;

      const variantSize = await VariantSizeModel.findOne({
        where: {
          variant_id: variantId,
          size_id: sizeId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE, // khóa row khi đọc
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

      // Cập nhật tồn kho
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
};