const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = 'YOUR_TOKEN_HERE';
const secret = process.env.JWT_SECRET;

try {
  const decoded = jwt.verify(token, secret);
  console.log("✅ Token hợp lệ:", decoded);
} catch (err) {
  console.error("❌ Token lỗi:", err.message);
}
