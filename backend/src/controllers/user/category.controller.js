const CategoryModel = require("../../models/Category");

exports.getAllCategories = async (req, res) => {
  const categories = await CategoryModel.findAll({
    where: { status: 1 },
    order: [["sort_order", "ASC"]],
  });
  res.json(categories);
};

exports.getCategoryById = async (req, res) => {
  const category = await CategoryModel.findByPk(req.params.id);
  res.json(category);
};
