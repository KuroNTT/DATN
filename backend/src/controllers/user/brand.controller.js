require("../../models/associations");
const BrandModel = require("../../models/Brand");

exports.getAllBrands = async (req, res) => {
  const brands = await BrandModel.findAll({
    where: {
      status: 1,
    },
  });
  res.json(brands);
};
