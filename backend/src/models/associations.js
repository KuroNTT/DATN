const ProductModel = require("./Product");
const ProductVariantModel = require("./ProductVariant");
const ProductImage = require("./ProductImage");
const CategoryModel = require("./Category");
const ColorModel = require("./Color");

// Một sản phẩm có nhiều biến thể
ProductModel.hasMany(ProductVariantModel, {
  foreignKey: "product_id",
  as: "variants",
});

// Một product thuộc một category
ProductModel.belongsTo(CategoryModel, {
  foreignKey: "category_id",
  as: "category",
});

// Một biến thể thuộc về một sản phẩm
ProductVariantModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
  as: "product",
});

// Một biến thể có nhiều ảnh
ProductVariantModel.hasMany(ProductImage, {
  foreignKey: "variant_id",
  as: "images",
});

// Một ảnh thuộc về một biến thể
ProductImage.belongsTo(ProductVariantModel, {
  foreignKey: "variant_id",
  as: "variant",
});

// Một biến thể có một màu sắc
ProductVariantModel.belongsTo(ColorModel, {
  foreignKey: "color_id",
  as: "color",
});
