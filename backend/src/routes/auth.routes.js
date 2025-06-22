const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const PRIVATE_KEY = fs.readFileSync("./private-key.txt");

router.post("/sign-up", async (req, res) => {
  const { name, email, password, re_password } = req.body;

  if (password !== re_password)
    return res.status(400).json({ thong_bao: "Hai mật khẩu không giống" });

  if (!email || password.length < 6)
    return res.status(400).json({ thong_bao: "Mật khẩu phải >=6 ký tự" });

  const user = await UserModel.findOne({ where: { email } });
  if (user) return res.status(400).json({ thong_bao: "Email đã tồn tại" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashed });

  res.json({ thong_bao: "Đăng ký thành công", user: newUser });
});

router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ thong_bao: "Email không tồn tại" });

  const matched = await bcrypt.compare(password, user.password);
  if (!matched)
    return res.status(401).json({ thong_bao: "Mật khẩu không đúng" });

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: "1h",
    subject: user.id.toString(),
  });

  res.status(200).json({
    token,
    expiresIn: "1h",
    info: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

module.exports = router;
