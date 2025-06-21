console.log("Đã chạy vào file index.js");

const express = require("express");
const { Op } = require("sequelize");
var app = express();
const port = 3000;
// require("dotenv").config();

app.use(express.json());
const cors = require("cors");
app.use(cors());

const {
  CategoryModel,
  ProductModel,
  UserModel,
} = require(".//database/database");

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

/* Lấy sản phẩm nhiều lượt xem */
app.get("/api/most-view-product/:countProduct", async (req, res) => {
  const countProduct = Number(req.params.countProduct) || 4;
  const product_arr = await ProductModel.findAll({
    where: {
      status: 1,
      view: {
        [Op.gt]: 100,
      },
    },
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

/* --------------------/ Sign In/Up /-------------------- */
/* Đăng ký */
app.post("/api/sign-up", async (req, res) => {
  let { name, email, password, re_password } = req.body;
  const user = await UserModel.findOne({ where: { email: email } });
  if (user != null)
    return res.status(401).json({ thong_bao: "Email đã tồn tại" });

  if (!email || !password || password.length < 6)
    return res.status(401).json({ thong_bao: "Mật khẩu phải >=6 ký tự" });

  if (password != re_password)
    return res.status(401).json({ thong_bao: "Hai mật khẩu không giống" });

  const bcrypt = require("bcryptjs");
  const mk_mahoa = await bcrypt.hash(password, 10);
  await UserModel.create({ email: email, name: name, password: mk_mahoa })
    .then((user) => res.json({ thong_bao: "Đăng ký thành công", user: user }))
    .catch((err) => res.json({ thong_bao: "Lỗi", err }));
});

/* Đăng nhập */
app.post("/api/sign-in", async (req, res) => {
  let { email, password } = req.body;

  const user = await UserModel.findOne({ where: { email: email } });
  if (user === null)
    return res.status(401).json({ thong_bao: "Email không tồn tại" });

  let encrypt_password = user.password;
  const bcrypt = require("bcryptjs");
  let kq = bcrypt.compareSync(password, encrypt_password);
  if (kq == false) return res.json({ thong_bao: "Mật khẩu không đúng" });

  // Tạo token
  const fs = require("fs");
  const PRIVATE_KEY = fs.readFileSync("./private-key.txt");
  const jwt = require("jsonwebtoken");
  const payload = { id: user.id, email: user.email }; // Nội dung token
  const maxAge = "1h";

  const bearToken = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: maxAge,
    subject: user.id + "",
  });

  res.status(200).json({
    token: bearToken,
    expiresIn: maxAge,
    info: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});
