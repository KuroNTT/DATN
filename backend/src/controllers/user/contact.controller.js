const nodemailer = require("nodemailer");

exports.sendMailToAdmin = async (req, res) => {
  const { fullName, email, content } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tvmkinhdoanhgiay@gmail.com",
      pass: process.env.APP_PASSWORD, // phải có biến này trong .env
    },
  });
  try {
    await transporter.sendMail({
      from: `${fullName}`,
      to: "tvmkinhdoanhgiay@gmail.com",
      subject: "Customer Contact",
      html: `<h4>Họ và tên ${fullName},</h4>
        <h4>email: ${email}</h4>
        <p>Nội dung: ${content}</p>`,
    });

    return res.status(201).json({
      thong_bao: "Gửi thông tin liên hệ thành công.",
    });
  } catch (err) {
    console.log(err);
  }
};
