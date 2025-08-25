
const WishlistModel = require("../../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  const user_id = req.user.id;
  const { variant_id, size } = req.body;

  if (!variant_id || !size) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin variant_id hoặc size" });
  }

  try {
    const exists = await WishlistModel.findOne({
      where: { user_id, variant_id, size },
    });

    if (exists) {
      return res
        .status(200)
        .json({ message: "Sản phẩm đã có trong danh sách yêu thích" });
    }
    await WishlistModel.create({
      user_id,
      variant_id,
      size,
      create_at: new Date(),
      is_active: true,
    });

    res.status(201).json({ message: "Đã thêm vào yêu thích" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.getWishlist = async (req, res) => {
  const user_id = req.user.id;

  try {
    const sequelize = require("../../config/sequelize");

    const [rows] = await sequelize.query(
      `SELECT 
                pw.id AS wishlist_id,
                pw.variant_id,
                s.size AS selected_size,
                pv.image_url, pv.style_code,
                p.name AS product_name, p.slug AS product_slug,
                p.price, p.price_sale
            FROM product_wish_list pw
            JOIN variant_sizes vs ON pw.size = vs.id
            JOIN sizes s ON vs.size_id = s.id
            JOIN product_variants pv ON pw.variant_id = pv.id
            JOIN products p ON pv.product_id = p.id
            WHERE pw.user_id = ? AND pw.is_active = 1

             `,
      { replacements: [user_id] }
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể lấy danh sách yêu thích" });
  }
};

exports.getFavoritesByUser = async (req, res) => {
  const user_id = req.user.id;
  try {
    const sequelize = require("../../config/sequelize");
    const [rows] = await sequelize.query(
      `SELECT DISTINCT p.id AS product_id
             FROM product_wish_list pw
             JOIN product_variants pv ON pw.variant_id = pv.id
             JOIN products p ON pv.product_id = p.id
             WHERE pw.user_id = ? AND pw.is_active = 1`,
      { replacements: [user_id] }
    );
    res.json({ productIds: rows.map((row) => row.product_id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể lấy danh sách yêu thích" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const user_id = req.user.id;
  const wishlist_id = req.params.wishlist_id;
  try {
    await WishlistModel.destroy({
      where: {
        id: wishlist_id,
        user_id
      }
    });
    res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể xóa khỏi yêu thích" });
  }
};
exports.removeFromWishlistIcon = async (req, res) => {
  const user_id = req.user.id;
  const variant_id = req.params.variant_id;

  try {
    await WishlistModel.destroy({
      where: {
        variant_id,
        user_id
      }
    });

    res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể xóa khỏi yêu thích" });
  }
};


