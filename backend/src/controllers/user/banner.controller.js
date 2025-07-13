require("../../models/associations");
const BannerModel = require("../../models/Banner");

exports.getAllBanner = async (req, res) => {
  const banners = await BannerModel.findAll({
    where: { active: 1 },
    order: [["created_at", "ASC"]],
  });
  res.json(banners);
};
