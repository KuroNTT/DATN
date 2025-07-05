const ProductModel = require("./Product");
const ProductVariantModel = require("./ProductVariant");
const ProductImage = require("./ProductImage");
const BrandsModel = require("./Brand");

// Một sản phẩm thuộc về một thương hiệu
ProductModel.belongsTo(BrandsModel, {
  foreignKey: "brand_id",
  as: "brand",
});
// 1 brand có nhiều sản phẩm
BrandsModel.hasMany(ProductModel, {
  foreignKey: "brand_id",
  as: "products",
});

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
ProductVariantModel.hasMany(ProductImage, {
  foreignKey: "variant_id",
  as: "images",
});

// Một ảnh thuộc về một biến thể
ProductImage.belongsTo(ProductVariantModel, {
  foreignKey: "variant_id",
  as: "variant",
});
