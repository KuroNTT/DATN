const BlogCategoryModel = require("../../models/BlogCategory");

exports.getAll = async (req, res) => {
  const categories = await BlogCategoryModel.findAll({
    order: [["sort_order", "ASC"]],
  });
  res.json(categories);
};

// Thêm danh mục mới
exports.create = async (req, res) => {
  try {
    const category = await BlogCategoryModel.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Sửa danh mục
exports.update = async (req, res) => {
  try {
    await BlogCategoryModel.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xoá danh mục
exports.remove = async (req, res) => {
  try {
    await BlogCategoryModel.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Xoá thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
