require("../../models/associations");
const BrandModel = require("../../models/Brand");

exports.getAllBrands = async (req, res) => {
  const brands = await BrandModel.findAll({
    order: [["id", "DESC"]],
  });
  res.json(brands);
};

exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await BrandModel.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy thương hiệu", error });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const brand = await BrandModel.create({
      name,
      description,
      status,
    });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm thương hiệu", error });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const brand = await BrandModel.findByPk(id);

    if (!brand)
      return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

    await brand.update({ name, description, status });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật thương hiệu", error });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await BrandModel.findByPk(id);

    if (!brand)
      return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

    await brand.destroy();
    res.json({ message: "Đã xóa thương hiệu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa thương hiệu", error });
  }
};
