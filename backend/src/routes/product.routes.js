const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const ProductModel = require("../models/Product");
const ProductVariantModel = require("../models/ProductVariant");
const ProductImageModel = require("../models/ProductImage");

// Một sản phẩm có nhiều biến thể
ProductModel.hasMany(ProductVariantModel, {
  foreignKey: "product_id",
  as: "variants",
});

// Một biến thể thuộc về một sản phẩm
ProductVariantModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
  as: "product",
});

// Một biến thể có nhiều ảnh
ProductVariantModel.hasMany(ProductImageModel, {
  foreignKey: "variant_id",
  as: "images",
});

// Một ảnh thuộc về một biến thể
ProductImageModel.belongsTo(ProductVariantModel, {
  foreignKey: "variant_id",
  as: "variant",
});

router.get("/", async (req, res) => {
  const products = await ProductModel.findAll({
    where: { status: 1 },
    order: [["created_at", "ASC"]],
    include: [{ model: ProductVariantModel, as: "variants" }],
  });
  res.json(products);
});

router.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  const product = await ProductModel.findOne({
    where: { slug },
    include: [
      {
        model: ProductVariantModel,
        as: "variants",
        include: [{ model: ProductImageModel, as: "images" }],
      },
    ],
  });
  res.json({ product });
});

router.get("/by-category/:id", async (req, res) => {
  const products = await ProductModel.findAll({
    where: { category_id: req.params.id, status: 1 },
    order: [
      ["created_at", "DESC"],
      ["price", "ASC"],
    ],
  });
  res.json(products);
});

router.get("/hot/:count", async (req, res) => {
  const count = Number(req.params.count) || 12;
  const products = await ProductModel.findAll({
    where: { status: 1, hot: 1 },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    limit: count,
  });
  res.json(products);
});

router.get("/most-view/:count", async (req, res) => {
  const count = Number(req.params.count) || 4;
  const products = await ProductModel.findAll({
    where: { status: 1, view: { [Op.gt]: 100 } },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    limit: count,
  });
  res.json(products);
});

router.get("/new/:count", async (req, res) => {
  const count = Number(req.params.count) || 8;
  const products = await ProductModel.findAll({
    where: { status: 1 },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    limit: count,
  });
  res.json(products);
});

module.exports = router;
