const ShoeHeightModel = require("../../models/ShoeHeight");

exports.getAllShoeHeight = async (req, res) => {
  const shoeHeights = await ShoeHeightModel.findAll({
    attributes: ["id", "name"],
    order: [["id", "ASC"]],
  });
  res.json(shoeHeights);
};
