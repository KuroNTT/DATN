require("../models/associations");
const { Op } = require("sequelize");
const ProductModel = require("../models/Product");
const ProductVariantModel = require("../models/ProductVariant");
const ProductImageModel = require("../models/ProductImage");
const CategoryModel = require("../models/Category");
const ColorModel = require("../models/Color");
const VariantSizeModel = require("../models/VariantSize");
const SizeModel = require("../models/Size");
const BrandModel = require("../models/Brand")
exports.getAllProducts = async (req, res) => {
  const searchQuery = req.query.q || "";
  const products = await ProductModel.findAll({
    where: {
      status: 1,
      ...(searchQuery && {
        name: {
          [Op.like]: `%${searchQuery}%`,
        },
      }),
    },
    order: [["created_at", "desc"]],
    include: [
      { model: ProductVariantModel, as: "variants" },
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



exports.getProductById =  async (req, res) => {
    try {
    const sp = await ProductModel.findByPk(req.params.id);
    sp ? res.json(sp) : res.status(404).json({ thong_bao: "Không tìm thấy" });
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi server", err });
  }

  }
exports.deleteProduct = async(req, res) => {
    try {
    const sp = await ProductModel.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ thong_bao: "Không tìm thấy" });
    await sp.destroy();
    res.json({ thong_bao: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi server", err });
  }

}
