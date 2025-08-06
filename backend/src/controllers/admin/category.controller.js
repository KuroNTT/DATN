const CategoryModel = require("../../models/Category");

const ProductModel = require("../../models/Product");

exports.getAll = async (req, res) => {
  const categories = await CategoryModel.findAll({
    order: [["sort_order", "DESC"]],
  });
  res.json(categories);
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm danh mục mới
exports.create = async (req, res) => {
  try {
    const category = await CategoryModel.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Sửa danh mục
exports.update = async (req, res) => {
  try {
    await CategoryModel.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xoá danh mục
// exports.remove = async (req, res) => {
//     try {
//         await CategoryModel.destroy({
//             where: { id: req.params.id },
//         });
//         res.json({ message: "Xoá thành công" });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

exports.remove = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 1. Kiểm tra xem danh mục còn sản phẩm nào không
    const productCount = await ProductModel.count({
      where: { category_id: categoryId },
    });

    if (productCount > 0) {
      return res.status(400).json({
        message: `Không thể xoá danh mục vì còn ${productCount} sản phẩm liên quan.`,
      });
    }

    // 2. Xoá nếu không còn sản phẩm
    const deleted = await CategoryModel.destroy({
      where: { id: categoryId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Danh mục không tồn tại." });
    }

    res.json({ message: "Xoá danh mục thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
