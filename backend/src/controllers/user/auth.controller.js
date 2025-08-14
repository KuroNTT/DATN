const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/User");
require("dotenv").config();
const nodemailer = require("nodemailer");

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

    const existingEmail = await UserModel.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({
        error: true,
        field: "email",
        message: "Email đã tồn tại",
      });
    }

    const existingName = await UserModel.findOne({ where: { name } });
    if (existingName) {
      return res.status(409).json({
        error: true,
        field: "name",
        message: "Tên đã tồn tại",
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

    //  Tạo user trong DB
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      account_lock: 1, // mặc định là bị khóa, chờ xác thực email
      created_at: new Date(),
      update_at: new Date(),
    });

    //  Trả lời ngay cho client (tránh chờ mail lâu)
    res.status(201).json({
      thong_bao:
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
    });

    //  Gửi email xác thực ở chế độ nền (không chờ)
    (async () => {
      try {
        const token = jwt.sign(
          { email: newUser.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "15m",
          }
        );

        const verifyLink = `http://localhost:4200/verify-email?token=${encodeURIComponent(
          token
        )}`;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "tvmkinhdoanhgiay@gmail.com",
            pass: process.env.APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: '"TVM Giày" <tvmkinhdoanhgiay@gmail.com>',
          to: newUser.email,
          subject: "Xác thực tài khoản của bạn tại TVM Giày",
          html: `
            <p>Xin chào ${newUser.name},</p>
            <p>Bạn vừa đăng ký tài khoản tại <strong>TVM Giày</strong>.</p>
            <p>Để hoàn tất quá trình đăng ký, vui lòng nhấn vào liên kết bên dưới để xác thực địa chỉ email của bạn:</p>
            <p><a href="${verifyLink}">${verifyLink}</a></p>
            <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,<br/>Đội ngũ TVM Giày</p>
          `,
        });

        console.log(` Đã gửi email xác thực tới: ${newUser.email}`);
      } catch (mailErr) {
        console.error(" Lỗi khi gửi email xác thực:", mailErr);
        // Optional: lưu lại log lỗi vào DB hoặc hệ thống theo dõi
      }
    })(); // chạy ngay
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
  const payload = { id: user.id, email: user.email };
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
    const { name, phone, sex, address, avatar } = req.body;

    // Tìm user
    const user = await UserModel.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Cập nhật
    user.name = name;
    user.phone = phone;
    user.sex = sex;
    user.address = address;
    if (avatar) user.avatar = avatar;

    await user.save();

    // Trả về thông tin mới
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      sex: user.sex,
      address: user.address,
      email_verify_at: user.email_verify_at,
    });
  } catch (err) {
    console.error(" Lỗi cập nhật:", err);
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

exports.forgotPw = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // Tạo token có chứa email để dùng xác thực
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:4200/reset-pw?token=${encodeURIComponent(
      token
    )}`;

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tvmkinhdoanhgiay@gmail.com",
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"TVM Giày" <tvmkinhdoanhgiay@gmail.com>',
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu tài khoản TVM Giày",
      html: `
    <p>Xin chào ${user.name},</p>

    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>TVM Giày</strong>.</p>

    <p>Vui lòng nhấn vào liên kết bên dưới để tạo mật khẩu mới. Liên kết này sẽ hết hạn sau <strong>15 phút</strong>:</p>

    <p><a href="${resetLink}">${resetLink}</a></p>

    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>

    <p>Trân trọng,<br/>Đội ngũ TVM Giày</p>
  `,
    });

    return res.json({ message: "Đã gửi email đặt lại mật khẩu" });
  } catch (err) {
    console.error("Lỗi gửi mail:", err);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
  }
};

exports.resetPw = async (req, res) => {
  const { token, new_password } = req.body;

  if (!token || !new_password) {
    return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy email từ token
    const user = await UserModel.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({
      message: "Đổi mật khẩu thành công. Bạn có thể đăng nhập lại",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    if (err.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Link đã hết hạn, vui lòng yêu cầu lại" });
    }
    return res
      .status(400)
      .json({ message: "Token không hợp lệ hoặc đã bị thay đổi" });
  }
};
