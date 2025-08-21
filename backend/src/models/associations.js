const ProductModel = require("./Product");
const ProductVariantModel = require("./ProductVariant");
const ProductImage = require("./ProductImage");
const CategoryModel = require("./Category");
const ColorModel = require("./Color");
const SizeModel = require("./Size");
const VariantSizeModel = require("./VariantSize");
const ShoeHeightModel = require("./ShoeHeight");
const GenderModel = require("./Gender");
const BlogModel = require("./Blog");
const BlogCategoryModel = require("./BlogCategory");
const UserModel = require("./User");
// chưa chắc
const BrandModel = require("./Brand");
const OrderModel = require("./Order");
const OrderDetailModel = require("./Order-detail");
const VoucherModel= require("./voucher");
const VoucherUserModel= require("./vocherUser");
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

/** 11. Mỗi variant đều có 1 kiểu cổ giày */
ProductVariantModel.belongsTo(ShoeHeightModel, {
  foreignKey: "shoe_height_id",
  as: "shoe_height",
});

/** 12. Mỗi sản phẩm đều có 1 giới tính */
ProductModel.belongsTo(GenderModel, {
  foreignKey: "gender_id",
  as: "gender",
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

BlogModel.belongsTo(UserModel, {
  foreignKey: "author_id",
  as: "author",
});

UserModel.hasMany(BlogModel, {
  foreignKey: "author_id",
  as: "blogs",
});
// Một đơn hàng có nhiều chi tiết đơn hàng
OrderModel.hasMany(OrderDetailModel, {
  foreignKey: "order_id",
  as: "order_details",
});

// Một chi tiết đơn hàng thuộc về một đơn hàng
OrderDetailModel.belongsTo(OrderModel, {
  foreignKey: "order_id",
  as: "order",
});
// Một chi tiết đơn hàng thuộc về một biến thể sản phẩm
OrderDetailModel.belongsTo(ProductVariantModel, {
  foreignKey: "variant_id",
  as: "product_variant",  // đặt alias cho dễ dùng
});

// Một biến thể sản phẩm có nhiều chi tiết đơn hàng (không bắt buộc nhưng tốt để đủ quan hệ 2 chiều)
ProductVariantModel.hasMany(OrderDetailModel, {
  foreignKey: "variant_id",
  as: "order_details",
});
// 1 voucher_user thuộc về 1 voucher
VoucherUserModel.belongsTo(VoucherModel, {
  foreignKey: "voucher_id",
  as: "voucher",
});

// 1 voucher có thể nhiều voucher_user
VoucherModel.hasMany(VoucherUserModel, {
  foreignKey: "voucher_id",
  as: "voucher_users",
});

