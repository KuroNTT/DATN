// 1. Load thư viện cần thiết
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// 2. Cấu hình biến môi trường
dotenv.config();

// 3. Khởi tạo Sequelize từ file cấu hình
const sequelize = require("./src/config/sequelize");

// 4. Khởi tạo ứng dụng Express
const app = express();

// 5. Cấu hình middleware toàn cục
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// 6. Kết nối và đồng bộ CSDL
sequelize
  .authenticate()
  .then(() => console.log("✅ MySQL connected"))
  .then(() => sequelize.sync({ alter: true }))
  .then(() => console.log("📦 DB synced"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// 7. Định nghĩa các route chính
app.use("/api/auth", require("./src/routes/user/auth.routes"));
app.use("/api/banners", require("./src/routes/user/banner.routes"));
app.use("/api/blogs", require("./src/routes/user/blog.routes"));
app.use("/api/brands", require("./src/routes/user/brand.routes"));
``;
app.use("/api/categories", require("./src/routes/user/category.routes"));
app.use("/api/carts", require("./src/routes/user/cart.routes"));
app.use("/api/colors", require("./src/routes/user/color.routes"));
app.use("/api/contacts", require("./src/routes/user/contact.routes"));
app.use("/api/genders", require("./src/routes/user/gender.routes"));
app.use("/api/shoe_heights", require("./src/routes/user/shoeHeight.routes"));
app.use("/api/sizes", require("./src/routes/user/size.routes"));
app.use("/api/products", require("./src/routes/user/product.routes"));
app.use("/api/orders", require("./src/routes/user/order.routes"));
app.use("/api/sizes", require("./src/routes/user/size.routes"));
app.use("/api/wishlist", require("./src/routes/user/wishlist.routes"));
app.use("/api/user", require("./src/routes/user/auth.routes"));
app.use("/api/voucher", require('./src/routes/user/voucher.routes'));
app.use("/api/stock", require('./src/routes/user/stock.routes'));

// Admin
app.use("/api/admin/blogs", require("./src/routes/admin/blog.routes"));
app.use("/api/admin/banners", require("./src/routes/admin/banner.routes"));
app.use(
  "/api/admin/blog-categories",
  require("./src/routes/admin/blogCategory.routes")
);
app.use("/api/admin/categories", require("./src/routes/admin/category.routes"));
app.use("/api/admin/products", require("./src/routes/admin/product.routes"));
// Cấu hình nhận form-data, JSON...
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "../public/images")));
app.use("/api/admin/upload", require("./src/routes/admin/upload.routes"));

// 8. Route kiểm tra server (mặc định)
app.get("/", (req, res) => {
  res.send("🚀 Welcome to TVM Shoes API");
});

// 9. Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Lỗi khi khởi chạy server:", err);
  } else {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  }
});
