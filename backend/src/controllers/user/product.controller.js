const { Op } = require("sequelize");
require("../../models/associations");

const ProductModel = require("../../models/Product");
const ProductVariantModel = require("../../models/ProductVariant");
const ProductImageModel = require("../../models/ProductImage");
const CategoryModel = require("../../models/Category");
const ColorModel = require("../../models/Color");
const VariantSizeModel = require("../../models/VariantSize");
const SizeModel = require("../../models/Size");
const ShoeHeightModel = require("../../models/ShoeHeight");
const GenderModel = require("../../models/Gender");
const BrandModel = require("../../models/Brand");

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

  const whereProduct = {
    status: 1,
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

exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ where: { slug } });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    const products = await Product.findAll({
      where: { category_id: category.id },
      include: [{ model: Category, attributes: ["name", "slug"] }],
    });

    res.json({ category, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
