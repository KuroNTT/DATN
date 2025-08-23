const dashboardService = require("../../services/dashboard.service");
require("../../models/associations");
const { Sequelize } = require("sequelize");
const BlogModel = require("../../models/Blog");
const UserModel = require("../../models/User");
const BlogCategoryModel = require("../../models/BlogCategory");
const ProductModel = require("../../models/Product");
const ProductVariantModel = require("../../models/ProductVariant");
const VariantSizeModel = require("../../models/VariantSize");
const ProductImageModel = require("../../models/ProductImage");
const { Op } = require("sequelize");
const OrderModel = require("../../models/Order");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "name", "avatar"],
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

/* exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // Đầu tuần
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); 
    startOfWeek.setHours(0, 0, 0, 0);

    // Cuối tuần (CN)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Đầu - cuối tháng
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const totalRevenue = await OrderModel.sum("total_price", {
      where: {
        status: "completed",
        create_at: { [Op.between]: [startOfWeek, endOfWeek] },
      },
    });

    const totalOrders = await OrderModel.count({
      where: { create_at: { [Op.between]: [startOfWeek, endOfWeek] } },
    });

    const newOrders = await OrderModel.count({
      where: {
        status: "pending",
        create_at: { [Op.between]: [startOfWeek, endOfWeek] },
      },
    });

    const newCustomers = await UserModel.count({
      where: { created_at: { [Op.between]: [startOfMonth, endOfMonth] } },
    });

    res.json({
      totalRevenue: totalRevenue || 0,
      totalOrders,
      newOrders,
      newCustomers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thống kê", error });
  }
}; */
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // --- Đầu và cuối tháng hiện tại ---
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // --- Doanh thu tháng này (chỉ đơn đã hoàn tất) ---
    const totalRevenue = await OrderModel.sum("total_price", {
      where: {
        status: "completed",
        create_at: { [Op.between]: [startOfMonth, endOfMonth] },
      },
    });

    // --- Tổng số đơn tháng này ---
    const totalOrders = await OrderModel.count({
      where: { create_at: { [Op.between]: [startOfMonth, endOfMonth] } },
    });

    // --- Đơn mới chờ xử lý trong tháng ---
    const newOrders = await OrderModel.count({
      where: {
        status: "pending",
        create_at: { [Op.between]: [startOfMonth, endOfMonth] },
      },
    });

    // --- Khách hàng mới trong tháng ---
    const newCustomers = await UserModel.count({
      where: { created_at: { [Op.between]: [startOfMonth, endOfMonth] } },
    });

    res.json({
      month: `${now.getMonth() + 1}/${now.getFullYear()}`,
      totalRevenue: totalRevenue || 0,
      totalOrders,
      newOrders,
      newCustomers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thống kê", error });
  }
};
