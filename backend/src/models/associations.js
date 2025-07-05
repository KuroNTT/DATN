const ProductModel = require("./Product");
const ProductVariantModel = require("./ProductVariant");
const ProductImage = require("./ProductImage");
const CategoryModel = require("./Category");
const ColorModel = require("./Color");
const SizeModel = require("./Size");
const VariantSizeModel = require("./VariantSize");

const BlogModel = require("./Blog");
const BlogCategoryModel = require("./BlogCategory");
// chưa chắc
const BrandModel = require("./Brand");

// Một sản phẩm thuộc về một thương hiệu
ProductModel.belongsTo(BrandModel, {
  foreignKey: "brand_id",
  as: "brand",
});
// 1 brand có nhiều sản phẩm
BrandModel.hasMany(ProductModel, {
  foreignKey: "brand_id",
  as: "products",
});
/** 1. Một sản phẩm có nhiều biến thể */
ProductModel.hasMany(ProductVariantModel, {
  foreignKey: "product_id",
  as: "variants",
});

/** 2. Một product thuộc một category */
ProductModel.belongsTo(CategoryModel, {
  foreignKey: "category_id",
  as: "category",
});

/** 3. Một biến thể thuộc về một sản phẩm */
ProductVariantModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
  as: "product",
});

/** 4. Một biến thể có nhiều ảnh */
ProductVariantModel.hasMany(ProductImage, {
  foreignKey: "variant_id",
  as: "images",
});

/**  5. Một ảnh thuộc về một biến thể */
ProductImage.belongsTo(ProductVariantModel, {
  foreignKey: "variant_id",
  as: "variant",
});

/** 6. Một biến thể có một màu sắc */
ProductVariantModel.belongsTo(ColorModel, {
  foreignKey: "color_id",
  as: "color",
});

/** 7. Mỗi biến thể có nhiều dòng variant_sizes */
ProductVariantModel.hasMany(VariantSizeModel, {
  foreignKey: "variant_id",
  as: "product_variant_sizes",
});

/** 8. Mỗi dòng variant_size thuộc về một biến thể */
VariantSizeModel.belongsTo(ProductVariantModel, {
  foreignKey: "variant_id",
  as: "variant",
});

/** 9. Mỗi dòng variant_size tham chiếu tới một size cụ thể */
VariantSizeModel.belongsTo(SizeModel, {
  foreignKey: "size_id",
  as: "size",
});

/** (tuỳ chọn) 10. Một size xuất hiện trong nhiều variant_size  */
SizeModel.hasMany(VariantSizeModel, {
  foreignKey: "size_id",
  as: "variant_sizes",
});


// Thiết lập mối quan hệ blog + cate
BlogModel.belongsTo(BlogCategoryModel, {
  foreignKey: "category_id",
  as: "category",
});

BlogCategoryModel.hasMany(BlogModel, {
  foreignKey: "category_id",
  as: "blogs",
});

