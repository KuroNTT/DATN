console.log("Đã chạy vào file index.js");

const express = require("express");
const { Op } = require("sequelize");
var app = express();
const port = 3000;
require("dotenv").config();

app.use(express.json());
const cors = require("cors");
app.use(cors());
const jwt = require("jsonwebtoken");

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

/* Đăng nhập */
app.post("/api/sign-in", async (req, res) => {
  let { email, password } = req.body;

  const user = await UserModel.findOne({ where: { email: email } });
  if (user === null)
    if (user === null)
      return res.status(401).json({
        error: true,
        field: "email",
        message: "Email không tồn tại",
      });
  let encrypt_password = user.password;
  const bcrypt = require("bcryptjs");
  let kq = bcrypt.compareSync(password, encrypt_password);
  if (kq === false) return res.status(401).json({
    error: true,
    field: "password",
    message: "Mật khẩu không đúng",
  });
  if (user.account_lock === 1 || !user.email_verify_at) {
    return res.status(403).json({
      error: true,
      message: "Tài khoản chưa xác thực hoặc đang bị khóa. Vui lòng kiểm tra email.",
    });


  }

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
/* Đăng ký */
app.post("/api/sign-up", async (req, res) => {
  const nodemailer = require("nodemailer");
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcryptjs");
  try {
    const { name, email, password, re_password } = req.body;

    if (!name || !email || !password || !re_password) {
      return res.status(400).json({
        error: true,
        field: "form",
        message: "Vui lòng nhập đủ thông tin",
      });
    }

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: true,
        field: "email",
        message: "Email đã tồn tại",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: true,
        field: "password",
        message: "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số",
      });
    }

    if (password !== re_password) {
      return res.status(400).json({
        error: true,
        field: "re_password",
        message: "Mật khẩu xác nhận không khớp",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Tạo user trong DB
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "customer", // ✅ thêm dòng này
      account_lock: 1, // ban đầu bị khóa (chưa xác thực email)
      created_at: new Date(),
      update_at: new Date(),
    });


    // ✅ Tạo token xác thực email
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    const verifyLink = `http://localhost:4200/verify-email?token=${encodeURIComponent(token)}`;

    // ✅ Gửi email
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tvmkinhdoanhgiay@gmail.com",
        pass: process.env.APP_PASSWORD, // phải có biến này trong .env
      },
    });

    await transporter.sendMail({
      from: '"TVM Giày" <tvmkinhdoanhgiay@gmail.com>',
      to: newUser.email,
      subject: "Xác thực tài khoản",
      html: `<p>Chào ${newUser.name},</p>
        <p>Bạn đã đăng ký tài khoản tại TVM Giày.</p>
        <p>Vui lòng nhấn vào liên kết dưới đây để xác thực email:</p>
        <a href="${verifyLink}">Xác thực tài khoản</a>`,
    });

    return res.status(201).json({
      thong_bao: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
    });
  } catch (err) {
    console.error("Lỗi server:", err); // ⚠️ RẤT QUAN TRỌNG
    return res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
});
// API xác thực email
app.post("/api/verify-email", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Thiếu token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token hợp lệ, thông tin:", decoded);

    await UserModel.update(
      {
        email_verify_at: new Date(),
        account_lock: 0,
      },
      {
        where: { email: decoded.email },
      }
    );

    res.json({ message: "Xác thực thành công. Tài khoản đã được kích hoạt." });
  } catch (err) {
    console.error("Lỗi xác thực token:", err.message);
    return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
});


