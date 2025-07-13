const sequelize = require('../../config/sequelize');
const ProductModel = require('../../models/Product');
const ColorModel = require ('../../models/Color');
const ProductVariantModel = require('../../models/ProductVariant');
const ProductImageModel  = require('../../models/ProductImage');
const VariantSizeModel  = require('../../models/VariantSize')
exports.getProductById = async (req, res) => {
  try {
    const sp = await ProductModel.findByPk(req.params.id);
    sp ? res.json(sp) : res.status(404).json({ thong_bao: "Không tìm thấy" });
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi server", err });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const sp = await ProductModel.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ thong_bao: "Không tìm thấy" });
    await sp.destroy();
    res.json({ thong_bao: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi server", err });
  }
};
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      await ProductModel.update({ status }, { where: { id } });
      res.json({ message: "Cập nhật thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });
    }
  };
exports.createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      brand_id,
      name,
      category_id,
      gender_id,
      description,
      slug,
      image,
      price,
      price_sale,
      origin_country,
      status  = 1,
      hot,
      view,
      variants=[]
    } = req.body;

    const now = new Date().toISOString();
    const fallbackImage  = variants?.[0]?.image_url || variants?.[0]?.image?.[0] || null;

    // 1. Tạo sản phẩm chính
    const product = await ProductModel.create({
      brand_id,
      name,
      category_id,
      gender_id,
      description,
      slug,
      image:image || fallbackImage,
      price,
      price_sale,
      origin_country,
      status,
      hot,
      view,
      created_at: now,
      updated_at: now
    }, { transaction: t });

    // 2. Tạo từng biến thể
    for (const variant of variants) {
      // 2.1 Tạo màu
      const color = await ColorModel.create({
        color_name: variant.color_name,
        original_name: variant.original_name,
        description: `Colorways dùng cho sản phẩm ${name}`
      }, { transaction: t });

      // 2.2 Lấy ảnh chính từ variant.images (nếu có)
      const image_url = variant.image_url || variant.images?.[0] || null;

      // 2.3 Tạo biến thể
      const variantData = await ProductVariantModel.create({
        product_id: product.id,
        color_id: color.id,
        shoe_height_id: variant.shoe_height_id,
        style_code: variant.style_code,
        image_url,
        status: 1,
        created_at: now,
        updated_at: now
      }, { transaction: t });

      // 2.4 Tạo size tồn kho
      for (const size of variant.sizes) {
        await VariantSizeModel.create({
          variant_id: variantData.id,
          size_id: size.size_id,
          stock: size.stock,
          created_at: now,
          updated_at: now
        }, { transaction: t });
      }

      // 2.5 Tạo ảnh phụ
      for (const image_url of variant.images) {
        await ProductImageModel.create({
          variant_id: variantData.id,
          image_url,
          created_at: now,
          updated_at: now
        }, { transaction: t });
      }
    }

    await t.commit();
    res.status(201).json({ message: "Thêm sản phẩm và các bảng liên quan thành công", product_id: product.id });

  } catch (error) {
    await t.rollback();
    console.error("Lỗi thêm sản phẩm:", error);
    res.status(400).json({ thong_bao: "Thêm thất bại", error: error.message });
  }
};
