// 1. Load thư viện cần thiết
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

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
    origin: "http://localhost:4200", // hoặc '*'
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ thêm Authorization
  })
);
app.use(express.json());

// 6. Kết nối và đồng bộ CSDL
sequelize
  .authenticate()
  .then(() => console.log("✅ MySQL connected"))
  .then(() => sequelize.sync({ alter: true }))
  .then(() => console.log("📦 DB synced"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

// 7. Định nghĩa các route chính
app.use("/api/categories", require("./src/routes/category.routes"));
app.use("/api/products", require("./src/routes/product.routes"));
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/orders", require("./src/routes/order.routes"));
app.use("/api/sizes", require("./src/routes/size.routes"));
const authRouter = require("./src/routes/auth.routes");
app.use("/api/user", authRouter);
app.use("/api/wishlist", require("./src/routes/wishlist.routes"));
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
