// const dashboardService = require("../../services/dashboard.service");
require("../../models/associations");
const { Sequelize } = require("sequelize");
const BlogModel = require("../../models/Blog");
const UserModel = require("../../models/User");
const BlogCategoryModel = require("../../models/BlogCategory");
const ProductModel = require("../../models/Product");
const ProductVariantModel = require("../../models/ProductVariant");
const VariantSizeModel = require("../../models/VariantSize");
const ProductImageModel = require("../../models/ProductImage");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: BlogCategoryModel,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error });
  }
};

exports.getNewProducts = async (req, res) => {
  {
    try {
      const products = await ProductModel.findAll({
        order: [["id", "DESC"]],
        limit: 5,
      });
      res.json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách sản phẩm mới", error });
    }
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll({
      attributes: [
        "id",
        "name",
        "image", // ảnh sản phẩm
        "price", // giá gốc
        "price_sale", // giá khuyến mãi
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("variants->product_variant_sizes.stock")
          ),
          "total_stock",
        ],
      ],
      include: [
        {
          model: ProductVariantModel,
          as: "variants",
          attributes: [],
          include: [
            {
              model: VariantSizeModel,
              as: "product_variant_sizes",
              attributes: [],
            },
          ],
        },
      ],
      group: [
        "products.id",
        "products.name",
        "products.image",
        "products.price",
        "products.price_sale",
      ],
      having: Sequelize.literal(
        "SUM(`variants->product_variant_sizes`.`stock`) < 100"
      ),
      order: [[Sequelize.literal("total_stock"), "ASC"]],
      limit: 10,
      subQuery: false,
    });

    res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm tồn kho thấp:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy sản phẩm tồn kho thấp", error });
  }
};
