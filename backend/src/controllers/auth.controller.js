const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("dotenv").config();

exports.signUp = async (req, res) => {
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

    const verifyLink = `http://localhost:4200/verify-email?token=${encodeURIComponent(
      token
    )}`;

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
};

exports.signIn = async (req, res) => {
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
  if (kq === false)
    return res.status(401).json({
      error: true,
      field: "password",
      message: "Mật khẩu không đúng",
    });
  if (user.account_lock === 1 || !user.email_verify_at) {
    return res.status(403).json({
      error: true,
      message:
        "Tài khoản chưa xác thực hoặc đang bị khóa. Vui lòng kiểm tra email.",
    });
  }

  // Tạo token
  const PRIVATE_KEY = process.env.JWT_SECRET;
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
};

exports.verifyEmail = async (req, res) => {
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
    return res
      .status(400)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    //console.log("Token resolved user:", req.user); // kiểm tra user có tồn tại không
    const user = await UserModel.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "sex",
        "address",
        "email_verify_at",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(user);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin người dùng:", err); // ✅ log lỗi chi tiết
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ middleware giải mã token

    // Các field được cho phép cập nhật
    const { name, phone, sex, address } = req.body;

    // Tìm user
    const user = await UserModel.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Cập nhật
    user.name = name;
    user.phone = phone;
    user.sex = sex;
    user.address = address;

    await user.save();

    // Trả về thông tin mới
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      sex: user.sex,
      address: user.address,
      email_verify_at: user.email_verify_at,
    });
  } catch (err) {
    console.error("❌ Lỗi cập nhật:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật" });
  }
};

exports.changePw = async (req, res) => {
  const { pass_old, passnew1, passnew2 } = req.body;
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ thong_bao: "Token không hợp lệ" });

  const token = authHeader.split(" ")[1];
  const PRIVATE_KEY = process.env.JWT_SECRET;

  let decoded;
  try {
    decoded = jwt.verify(token, PRIVATE_KEY);
  } catch (err) {
    return res
      .status(403)
      .json({ thong_bao: "Token hết hạn hoặc không hợp lệ" });
  }

  const id = decoded.id;
  const user = await UserModel.findByPk(id);
  if (!user)
    return res.status(404).json({ thong_bao: "Không tìm thấy người dùng" });

  const pw_db = user.password;
  const isMatch = bcrypt.compareSync(pass_old, pw_db);
  if (!isMatch) {
    return res.status(403).json({
      error: true,
      field: "pass_old",
      message: "Mật khẩu cũ không đúng",
    });
  }

  if (passnew1 !== passnew2) {
    return res.json({
      error: true,
      field: "passnew2",
      message: "Hai mật khẩu không khớp",
    });
  }
  if (!passnew1 || passnew1 !== passnew2)
    return res.json({ thong_bao: "Hai mật khẩu mới không khớp hoặc rỗng" });

  const isSameAsOld = bcrypt.compareSync(passnew1, pw_db);
  if (isSameAsOld) {
    return res.status(400).json({
      error: true,
      field: "passnew1",
      message: "Mật khẩu mới không được giống mật khẩu cũ",
    });
  }
  const mk_mahoa = bcrypt.hashSync(passnew1, bcrypt.genSaltSync(10));
  await UserModel.update({ password: mk_mahoa }, { where: { id } });

  res.status(200).json({ thong_bao: "Đã thay đổi mật khẩu thành công" });
};
