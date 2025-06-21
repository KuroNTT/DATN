console.log("Đã chạy vào file index.js");

const express = require("express");
var app = express();
const port = 3000;

app.use(express.json());
const cors = require("cors");
app.use(cors());

const { CategoryModel, ProductModel } = require(".//database/database");

app.listen(port, (err) => {
  if (err) {
    console.error("Lỗi xảy ra khi chạy ứng dụng:", err);
  } else {
    console.log(`Ứng dụng đang chạy ở port: ${port}`);
  }
});

/* --------------------/ Categories /-------------------- */
/* Lấy tất cả danh mục */
app.get("/api/categories", async (req, res) => {
  const category_arr = await CategoryModel.findAll({
    where: { status: 1 },
    order: [["sort_order", "ASC"]],
  });
  res.json(category_arr);
});

/* Lấy danh mục theo id*/
app.get("/api/category/:id", async (req, res) => {
  const category = await CategoryModel.findByPk(req.params.id);
  res.json(category);
});

/* --------------------/ Products /-------------------- */
/* Lấy tất cả sản phẩm */
app.get("/api/products", async (req, res) => {
  const product_arr = await ProductModel.findAll({
    where: { status: 1 },
    order: [["created_at", "ASC"]],
  });
  res.json(product_arr);
});

/* Lấy sản phẩm theo id */
app.get("/api/product/:id", async (req, res) => {
  const id = Number(req.params.id);
  const product = await ProductModel.findOne({
    where: { id: id },
  });
  res.json({ product: product });
});

/* Lấy sản phẩm theo danh mục */
app.get("/api/product-by-category/:id", async (req, res) => {
  const category_id = Number(req.params.id);
  const product_arr = await ProductModel.findAll({
    where: { category_id: category_id, status: 1 },
    order: [
      ["created_at", "DESC"],
      ["price", "ASC"],
    ],
  });
  res.json(product_arr);
});

/* Lấy sản phẩm hot */
app.get("/api/hot-product/:countProduct", async (req, res) => {
  const countProduct = Number(req.params.countProduct) || 12;
  const product_arr = await ProductModel.findAll({
    where: { status: 1, hot: 1 },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    offset: 0,
    limit: countProduct,
  });
  res.json(product_arr);
});

/* Lấy sản phẩm mới */
app.get("/api/new-product/:countProduct", async (req, res) => {
  const countProduct = Number(req.params.id) || 8;
  const product_arr = await ProductModel.findAll({
    where: { status: 1 },
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    offset: 0,
    limit: countProduct,
  });
  res.json(product_arr);
});
