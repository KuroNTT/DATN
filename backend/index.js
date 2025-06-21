const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

// middle ware 

app.use(express.json());
app.use(cors());


const {UserModel} = require("./config/db.config")
// Router
app.post("/api/dangky", async (req, res) => {
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
await UserModel
    .create({ email: email, name: name, password: mk_mahoa})
    .then(  user =>  res.json( { "thong_bao": "Đăng ký thành công", "user" : user})  )
    .catch(  err => res.json( {"thong_bao":"Lỗi", err } )  )   

 
});
app.post("/api/dangnhap", async (req, res) => {
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
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
    .on('error', (err) => {
        console.error(`Error starting server on port ${process.env.PORT}, error: ${err}`);
    })