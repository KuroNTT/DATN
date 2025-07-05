const SizeModel = require("../models/Size");

exports.getAllSize = async (req, res) => {
  const sizes = await SizeModel.findAll({
    order: [["size", "ASC"]],
  });
  res.json(sizes);
};
