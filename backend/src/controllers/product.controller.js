require("../models/associations");
const { Op } = require("sequelize");
const ProductModel = require("../models/Product");
const ProductVariantModel = require("../models/ProductVariant");
const ProductImageModel = require("../models/ProductImage");
const CategoryModel = require("../models/Category");
const ColorModel = require("../models/Color");

exports.getAllProducts = async (req, res) => {
  const products = await ProductModel.findAll({
    where: { status: 1 },
    order: [["created_at", "ASC"]],
    include: [
      { model: ProductVariantModel, as: "variants" },
      {
        model: CategoryModel,
        as: "category",
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
        ],
      },
      {
        model: CategoryModel,
        as: "category",
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
    where: { status: 1, view: { [Op.gt]: 100 } },
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
