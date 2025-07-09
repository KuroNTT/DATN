const { Op } = require("sequelize");
const sequelize = require("../config/sequelize"); // ✅ đúng vì bạn export trực tiếp biến
require("../models/associations");

const ProductModel = require("../models/Product");
const ProductVariantModel = require("../models/ProductVariant");
const ProductImageModel = require("../models/ProductImage");
const CategoryModel = require("../models/Category");
const ColorModel = require("../models/Color");
const VariantSizeModel = require("../models/VariantSize");
const SizeModel = require("../models/Size");
const ShoeHeightModel = require("../models/ShoeHeight");
const GenderModel = require("../models/Gender");

const BrandModel = require("../models/Brand");
exports.getAllProducts = async (req, res) => {
  const searchQuery = req.query.q || "";
  const collarIdsRaw = req.query.collars || "";
  const collarIds = collarIdsRaw.split(",").map(Number).filter(Boolean);
  const brandIdsRaw = req.query.brands || "";
  const brandIds = brandIdsRaw.split(",").map(Number).filter(Boolean);
  const genderIdsRaw = req.query.genders || "";
  const genderIds = genderIdsRaw.split(",").map(Number).filter(Boolean);
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
    required: collarIds.length > 0,
    include: [
      {
        model: ShoeHeightModel,
        as: "shoe_height",
        attributes: ["id", "name"],
      },
    ],
  };

  if (collarIds.length > 0) {
    variantInclude.where = {
      shoe_height_id: { [Op.in]: collarIds },
    };
  }

  /* ---------- 3. Xây where của Product ---------- */
  const whereProduct = {
    status: 1,
    ...(searchQuery && {
      name: { [Op.like]: `%${searchQuery}%` },
    }),
    ...(brandIds.length && { brand_id: { [Op.in]: brandIds } }),
    ...(genderIds.length && { gender_id: { [Op.in]: genderIds } }),
  };

  // ➡️ Bổ sung điều kiện lọc giá
  if (priceRanges.length) {
    whereProduct[Op.or] = priceRanges.map((r) =>
      r.max != null
        ? { price_sale: { [Op.between]: [r.min, r.max] } }
        : { price_sale: { [Op.gte]: r.min } }
    );
  }

  const products = await ProductModel.findAll({
    where: {
      status: 1,
      ...(searchQuery && {
        name: { [Op.like]: `%${searchQuery}%` },
      }),
      ...(brandIds.length && {
        brand_id: { [Op.in]: brandIds },
      }),
      ...(genderIds.length && {
        gender_id: { [Op.in]: genderIds },
      }),
      ...(priceRanges.length && {
        [Op.or]: priceRanges.map((r) =>
          r.max != null
            ? { price_sale: { [Op.between]: [r.min, r.max] } }
            : { price_sale: { [Op.gte]: r.min } }
        ),
      }),
    },
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

exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  const product = await ProductModel.findOne({
    where: { slug },
    include: [
      {
        model: ProductVariantModel,
        as: "variants",
        include: [
          { model: ProductImageModel, as: "images" },
          { model: ColorModel, as: "color" },
          {
            model: VariantSizeModel,
            as: "product_variant_sizes",
            attributes: ["stock"],
            include: [
              {
                model: SizeModel,
                as: "size",
                attributes: ["id", "size"],
              },
            ],
          },
        ],
      },
      {
        model: CategoryModel,
        as: "category",
        attributes: ["name"],
      },
      {
        model: BrandModel,
        as: "brand",
        attributes: ["name"],
      },
    ],
  });
  res.json({ product });
};

exports.getProductByCategory = async (req, res) => {
  const products = await ProductModel.findAll({
    where: { category_id: req.params.id, status: 1 },
    order: [
      ["created_at", "DESC"],
      ["price", "ASC"],
    ],
    include: [
      {
        model: CategoryModel,
        as: "category",
        attributes: ["name"],
      },
    ],
  });
  res.json(products);
};

exports.getHotProducts = async (req, res) => {
  const count = Number(req.params.count) || 12;
  const products = await ProductModel.findAll({
    where: { status: 1, hot: 1 },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    include: [
      {
        model: CategoryModel,
        as: "category",
        attributes: ["name"],
      },
    ],
    limit: count,
  });
  res.json(products);
};

exports.getMostViewed = async (req, res) => {
  const count = Number(req.params.count) || 4;
  const products = await ProductModel.findAll({
    where: { status: 1, view: { [Op.gt]: 50 } },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    include: [
      {
        model: CategoryModel,
        as: "category",
        attributes: ["name"],
      },
    ],
    limit: count,
  });
  res.json(products);
};

exports.getNewProducts = async (req, res) => {
  const count = Number(req.params.count) || 8;
  const products = await ProductModel.findAll({
    where: { status: 1 },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    include: [
      {
        model: CategoryModel,
        as: "category",
        attributes: ["name"],
      },
    ],
    limit: count,
  });
  res.json(products);
};

exports.searchProducts = async (req, res) => {
  const searchQuery = req.query.q || "";
  try {
    const [rows] = await db.execute(
      `SELECT * FROM products WHERE name LIKE ?`,
      [`%${searchQuery}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn database" });
  }
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
  /*  exports.createProduct = async (req, res) => {
  try {
    const {
      id,
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
      status,
      hot,
      view,
      created_at,
      update_at
    } = req.body;

    const sp = await ProductModel.create({
      id,
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
      status,
      hot,
      view,
      created_at,
      update_at
    });
    res.status(201).json(sp);
  } catch (error) {
    res.status(400).json({ thong_bao: error.message });
  }
  console.log("req.body", req.body);

}; */

/* exports.createProduct = async (req, res) => {
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
      status,
      hot,
      view,
      variants
    } = req.body;

    // 1. Tạo sản phẩm chính
    const product = await ProductModel.create({
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
      status,
      hot,
      view,
    }, { transaction: t });

    // 2. Tạo từng biến thể
    for (const variant of variants) {
      const variantData = await ProductVariantModel.create({
        product_id: product.id,
        color_id: variant.color_id,
      }, { transaction: t });
const variantId = variantData.id; // MySQL tự sinh, Sequelize trả về

      // 3. Tạo size tồn kho
      for (const size of variant.sizes) {
        await VariantSizeModel.create({
          variant_id: variantData.id,
          size_id: size.size_id,
          stock: size.stock
        }, { transaction: t });
      }

      // 4. Tạo ảnh
      for (const image_url of variant.images) {
        await ProductImageModel.create({
          variant_id: variantData.id,
          image_url
        }, { transaction: t });
      }
    }

    await t.commit();
    res.status(201).json({ message: "Thêm sản phẩm và các bảng liên quan thành công", product_id: product.id });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ thong_bao: "Thêm thất bại", error: error.message });
  }
}; */

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
      status,
      hot,
      view,
      variants
    } = req.body;

    const now = new Date().toISOString();

    // 1. Tạo sản phẩm chính
    const product = await ProductModel.create({
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
      const main_image_url = variant.images?.[0] || null;

      // 2.3 Tạo biến thể
      const variantData = await ProductVariantModel.create({
        product_id: product.id,
        color_id: color.id,
        shoe_height_id: variant.shoe_height_id,
        style_code: variant.style_code,
        image_url: main_image_url,
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
    console.error("❌ Lỗi thêm sản phẩm:", error);
    res.status(400).json({ thong_bao: "Thêm thất bại", error: error.message });
  }
};


