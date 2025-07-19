require("../../models/associations");
const BannerModel = require("../../models/Banner");

exports.getAllBanner = async (req, res) => {
  const banners = await BannerModel.findAll({
    where: { active: 1 },
    order: [["created_at", "ASC"]],
  });
  res.json(banners);
};

exports.getBannerById = async (req, res) => {
  const banner = await BannerModel.findByPk(req.params.id);
  if (!banner)
    return res.status(404).json({ message: "Không tìm thấy banner" });
  res.json(banner);
};

exports.createBanner = async (req, res) => {
  try {
    const { title, image, link } = req.body;

    const newBanner = await BannerModel.create({
      title,
      image_url: image,
      link,
    });

    res
      .status(201)
      .json({ message: "Tạo banner thành công", banner: newBanner });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo banner", error });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, link, image } = req.body;

    const banner = await BannerModel.findByPk(id);
    if (!banner)
      return res.status(404).json({ message: "Không tìm thấy banner" });

    banner.title = title;
    banner.link = link;
    if (image) banner.image_url = image;

    await banner.save();

    res.json({ message: "Cập nhật banner thành công", banner });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật banner", error });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await BannerModel.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }

    res.json({ message: "Xóa banner thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa banner", error });
  }
};
