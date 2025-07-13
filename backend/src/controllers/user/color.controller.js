require("../../models/associations");
const ColorModel = require("../../models/Color");

exports.getAllColors = async (req, res) => {
  try {
    const colors = await ColorModel.findAll();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách màu sắc" });
  }
};
