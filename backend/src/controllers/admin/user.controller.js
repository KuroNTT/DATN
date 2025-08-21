const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserModel = require("../../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ["id", "name","avatar", "email", "role", "account_lock","email_verify_at", "created_at", "deleted_at"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        field: "id",
        message: "Người dùng không tồn tại",
      });
    }

    if (user.deleted_at) {
      return res.status(400).json({
        error: true,
        field: "id",
        message: "Người dùng đã bị xoá trước đó",
      });
    }

    await user.update({ deleted_at: new Date() });

    return res.json({
      error: false,
      message: "Xoá người dùng (soft delete) thành công",
    });
  } catch (err) {
    console.error("Lỗi softDeleteUser:", err);
    return res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
};

exports.toggleLockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        field: "id",
        message: "Người dùng không tồn tại",
      });
    }

    if (user.deleted_at) {

      return res.status(400).json({
        error: true,
        field: "id",
        message: "Người dùng đã bị xoá, không thể khoá/mở khoá",
      });
    }

    const newStatus = user.account_lock === 1 ? 0 : 1;

    await user.update({ account_lock: newStatus });

    return res.json({
      error: false,
      message: newStatus ? "Tài khoản đã bị khoá" : "Tài khoản đã được mở khoá",
    });
  } catch (err) {
    console.error("Lỗi toggleLockUser:", err);
    return res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // 'admin' | 'customer'
    if (!role || !["admin", "customer"].includes(role)) {
      return res.status(400).json({
        error: true,
        field: "role",
        message: "Vai trò không hợp lệ",
      });
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        field: "id",
        message: "Người dùng không tồn tại",
      });
    }

    if (user.deleted_at) {
      return res.status(400).json({
        error: true,
        field: "id",
        message: "Người dùng đã bị xoá, không thể thay đổi role",
      });
    }

    await user.update({ role });
    return res.json({
      error: false,
      message: "Cập nhật vai trò người dùng thành công",
    });
  } catch (err) {
    console.error("Lỗi changeUserRole:", err);
    return res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
};

exports.resendVerify = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Vui lòng nhập email" });
    }

    const user = await UserModel.findOne({
      where: { email, deleted_at: null },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: true, message: "Không tìm thấy user" });
    }

    if (user.email_verify_at) {
      return res
        .status(400)
        .json({ error: true, message: "Tài khoản này đã xác minh email" });
    }

    // tạo token verify (15 phút)
    const token = jwt.sign(
      { email: user.email, uid: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
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
      to: user.email,
      subject: "Xác thực tài khoản - TVM Giày",
      html: `
        <p>Xin chào ${user.name || "bạn"},</p>
        <p>Tài khoản của bạn trên <strong>TVM Giày</strong> vẫn chưa được xác minh.</p>
        <p>Admin vừa gửi lại email xác thực, vui lòng nhấn vào liên kết bên dưới để hoàn tất xác minh:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
        <p>Nếu bạn đã xác minh trước đó, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br/>Đội ngũ TVM Giày</p>
      `,
    });

    return res.json({
      error: false,
      message: "Admin đã gửi lại email xác thực đến user thành công.",
    });
  } catch (err) {
    console.error("Lỗi resendVerify:", err);
    return res
      .status(500)
      .json({ error: true, message: "Có lỗi xảy ra khi gửi lại email." });
  }
};
