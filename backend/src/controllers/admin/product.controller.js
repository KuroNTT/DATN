const { Op } = require("sequelize");
require("../../models/associations");
const sequelize = require("../../config/sequelize");
const ProductModel = require("../../models/Product");
const ColorModel = require("../../models/Color");
const BrandModel = require("../../models/Brand");
const CategoryModel = require("../../models/Category");
const GenderModel = require("../../models/Gender");
const ShoeHeightModel = require("../../models/ShoeHeight");
const SizeModel = require("../../models/Size");
const ProductImageModel = require("../../models/ProductImage");
const ProductVariantModel = require("../../models/ProductVariant");
const VariantSizeModel = require("../../models/VariantSize");

exports.getAllProducts = async (req, res) => {
  const searchQuery = req.query.q || "";
  const collarIdsRaw = req.query.collars || "";
  const collarIds = collarIdsRaw.split(",").map(Number).filter(Boolean);
  const brandIdsRaw = req.query.brands || "";
  const brandIds = brandIdsRaw.split(",").map(Number).filter(Boolean);
  const genderIdsRaw = req.query.genders || "";
  const genderIds = genderIdsRaw.split(",").map(Number).filter(Boolean);
  const sizeIdsRaw = req.query.sizes || "";
  const sizeIds = sizeIdsRaw.split(",").map(Number).filter(Boolean);
  const colorKeywordsRaw = req.query.colors || "";
  const colorKeywords = colorKeywordsRaw
    .split(",")
    .map((str) => str.trim().toLowerCase())
    .filter(Boolean);

  const priceRanges = (req.query.prices || "")
    .split(",")
    .map((r) => {
      const [min, max] = r.split("-").map(Number);
      return { min, max: isNaN(max) ? null : max };
    })
    .filter((r) => !isNaN(r.min));

  const variantInclude = {
    model: ProductVariantModel,
    as: "variants",
    required: collarIds.length > 0 || sizeIds.length > 0,
    include: [
      {
        model: ShoeHeightModel,
        as: "shoe_height",
        attributes: ["id", "name"],
      },
      {
        model: VariantSizeModel,
        as: "product_variant_sizes",
        required: sizeIds.length > 0,
        attributes: ["stock"],
        ...(sizeIds.length > 0 && {
          where: {
            size_id: { [Op.in]: sizeIds },
          },
        }),
        include: [
          {
            model: SizeModel,
            as: "size",
            attributes: ["id", "size"],
          },
        ],
      },
      {
        model: ColorModel,
        as: "color",
        attributes: ["id", "color_name"],
        ...(colorKeywords.length > 0 && {
          where: {
            [Op.or]: colorKeywords.map((kw) => ({
              color_name: { [Op.like]: `%${kw}%` },
            })),
          },
          required: true,
        }),
      },
    ],
  };

  if (collarIds.length > 0) {
    variantInclude.where = {
      shoe_height_id: { [Op.in]: collarIds },
    };
  }
  const statusParam = req.query.status;
  const status = statusParam !== undefined ? Number(statusParam) : null;
  const whereProduct = {
    ...(status !== null && !isNaN(status) && { status }),
    ...(searchQuery && {
      name: { [Op.like]: `%${searchQuery}%` },
    }),
    ...(brandIds.length && { brand_id: { [Op.in]: brandIds } }),
    ...(genderIds.length && { gender_id: { [Op.in]: genderIds } }),
  };

  if (priceRanges.length) {
    whereProduct[Op.or] = priceRanges.map((r) =>
      r.max != null
        ? { price_sale: { [Op.between]: [r.min, r.max] } }
        : { price_sale: { [Op.gte]: r.min } }
    );
  }

  const products = await ProductModel.findAll({
    where: whereProduct,
    order: [["created_at", "desc"]],
    include: [
      variantInclude,
      {
        model: CategoryModel,
        as: "category",
        attributes: ["name"],
      },
      {
        model: GenderModel,
        as: "gender",
        attributes: ["id", "name"],
      },
      {
        model: BrandModel,
        as: "brand",
        attributes: ["name"],
      },
    ],
  });
  res.json(products);
};

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
    const productId = req.params.id;

    const product = await ProductModel.findByPk(productId, {
      include: [
        {
          model: ProductVariantModel,
          as: "variants",
          attributes: ["id", "color_id"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ thong_bao: "Không tìm thấy sản phẩm" });
    }

    const usedColorIds = [...new Set(product.variants.map((v) => v.color_id))];

    // Xoá sản phẩm chính (đã cascade variant, images, sizes nếu cấu hình đúng)
    await product.destroy();

    // Sau khi xoá, kiểm tra từng color
    for (const colorId of usedColorIds) {
      const count = await ProductVariantModel.count({
        where: { color_id: colorId },
      });
      if (count === 0) {
        await ColorModel.destroy({ where: { id: colorId } });
      }
    }

    res.json({ thong_bao: "Đã xóa sản phẩm và các màu không còn sử dụng" });
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
      status = 1,
      hot,
      view,
      variants = [],
    } = req.body;

    const now = new Date().toISOString();
    const fallbackImage =
      variants?.[0]?.image_url || variants?.[0]?.image?.[0] || null;

    // 1. Tạo sản phẩm chính
    const product = await ProductModel.create(
      {
        brand_id,
        name,
        category_id,
        gender_id,
        description,
        slug,
        image: image || fallbackImage,
        price,
        price_sale,
        origin_country,
        status,
        hot,
        view,
        created_at: now,
        updated_at: now,
      },
      { transaction: t }
    );

    // 2. Tạo từng biến thể
    for (const variant of variants) {
      // 2.1 Tạo màu
      const color = await ColorModel.create(
        {
          color_name: variant.color_name,
          original_name: variant.original_name,
          description: `Colorways dùng cho sản phẩm ${name}`,
        },
        { transaction: t }
      );

      // 2.2 Lấy ảnh chính từ variant.images (nếu có)
      const image_url = variant.image_url || variant.images?.[0] || null;

      // 2.3 Tạo biến thể
      const variantData = await ProductVariantModel.create(
        {
          product_id: product.id,
          color_id: color.id,
          shoe_height_id: variant.shoe_height_id,
          style_code: variant.style_code,
          image_url,
          status: 1,
          created_at: now,
          updated_at: now,
        },
        { transaction: t }
      );

      // 2.4 Tạo size tồn kho
      for (const size of variant.sizes) {
        await VariantSizeModel.create(
          {
            variant_id: variantData.id,
            size_id: size.size_id,
            stock: size.stock,
            created_at: now,
            updated_at: now,
          },
          { transaction: t }
        );
      }

      // 2.5 Tạo ảnh phụ
      for (const image_url of variant.images) {
        await ProductImageModel.create(
          {
            variant_id: variantData.id,
            image_url,
            created_at: now,
            updated_at: now,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    res.status(201).json({
      message: "Thêm sản phẩm và các bảng liên quan thành công",
      product_id: product.id,
    });
  } catch (error) {
    await t.rollback();
    console.error("Lỗi thêm sản phẩm:", error);
    res.status(400).json({ thong_bao: "Thêm thất bại", error: error.message });
  }
};

exports.updateProductBySlug = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const slug = req.params.slug;
    const {
      name,
      price,
      price_sale,
      image,
      origin_country,
      brand_id,
      category_id,
      gender_id,
      description,
      status,
      hot,
      view,
      variants = [],
    } = req.body;

    const now = new Date().toISOString();

    const product = await ProductModel.findOne({ where: { slug } });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Cập nhật sản phẩm chính
    await product.update(
      {
        name,
        price,
        price_sale,
        image,
        origin_country,
        brand_id,
        category_id,
        gender_id,
        description,
        status,
        hot,
        view,
        updated_at: now,
      },
      { transaction: t }
    );

    for (const variant of variants) {
      let color;

      // Nếu có color_id → update màu
      if (variant.color_id) {
        color = await ColorModel.findByPk(variant.color_id);
        if (color) {
          await color.update(
            {
              color_name: variant.color_name,
              original_name: variant.original_name,
              description: `Colorways dùng cho sản phẩm ${name}`,
            },
            { transaction: t }
          );
        }
      } else {
        // Nếu chưa có → tạo mới
        color = await ColorModel.create(
          {
            color_name: variant.color_name,
            original_name: variant.original_name,
            description: `Colorways dùng cho sản phẩm ${name}`,
          },
          { transaction: t }
        );
      }

      let variantData;

      // Nếu có id → cập nhật biến thể
      if (variant.id) {
        variantData = await ProductVariantModel.findByPk(variant.id);
        if (variantData) {
          await variantData.update(
            {
              color_id: color.id,
              shoe_height_id: variant.shoe_height_id,
              style_code: variant.style_code,
              image_url: variant.image_url,
              updated_at: now,
            },
            { transaction: t }
          );

          // Xoá toàn bộ sizes & images cũ
          await VariantSizeModel.destroy({
            where: { variant_id: variantData.id },
            transaction: t,
          });
          await ProductImageModel.destroy({
            where: { variant_id: variantData.id },
            transaction: t,
          });
        }
      } else {
        // Nếu chưa có → tạo mới
        variantData = await ProductVariantModel.create(
          {
            product_id: product.id,
            color_id: color.id,
            shoe_height_id: variant.shoe_height_id,
            style_code: variant.style_code,
            image_url: variant.image_url,
            status: 1,
            created_at: now,
            updated_at: now,
          },
          { transaction: t }
        );
      }

      // Tạo lại size mới
      for (const size of variant.sizes) {
        await VariantSizeModel.create(
          {
            variant_id: variantData.id,
            size_id: size.size_id,
            stock: size.stock,
            created_at: now,
            updated_at: now,
          },
          { transaction: t }
        );
      }

      // Tạo lại ảnh mới
      for (const imageUrl of variant.images) {
        await ProductImageModel.create(
          {
            variant_id: variantData.id,
            image_url: imageUrl,
            created_at: now,
            updated_at: now,
          },
          { transaction: t }
        );
      }
    }
    const { deletedVariantIds = [] } = req.body;

    // Xoá tất cả các variant liên quan trước khi cập nhật
    if (deletedVariantIds.length > 0) {
      await ProductVariantModel.destroy({
        where: {
          id: deletedVariantIds,
        },
      });
    }

    await t.commit();
    res.json({
      message: "Cập nhật sản phẩm thành công",
      product_id: product.id,
    });
  } catch (error) {
    await t.rollback();
    console.error("Lỗi cập nhật sản phẩm:", error);
    res
      .status(500)
      .json({ message: "Cập nhật thất bại", error: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await ProductModel.findOne({
      where: { slug },
      include: [
        {
          model: ProductVariantModel,
          as: "variants",
          include: [
            {
              model: ColorModel,
              as: "color",
            },
            {
              model: ProductImageModel,
              as: "images",
            },
            {
              model: VariantSizeModel,
              as: "product_variant_sizes",
              include: [
                {
                  model: SizeModel,
                  as: "size",
                },
              ],
            },
            {
              model: ShoeHeightModel,
              as: "shoe_height",
            },
          ],
        },
        {
          model: BrandModel,
          as: "brand",
        },
        {
          model: CategoryModel,
          as: "category",
        },
        {
          model: GenderModel,
          as: "gender",
        },
      ],
    });

    if (!product) {
      console.warn("Không tìm thấy sản phẩm với slug:", slug);
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo slug:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
