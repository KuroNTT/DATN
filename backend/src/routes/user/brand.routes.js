const express = require("express");
const router = express.Router();
const BrandModel = require("../../models/Brand");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  const { brandIds } = req.query;

  let whereClause = { status: 1 };

  if (brandIds) {
    const brandIdArray = brandIds.split(",").map((id) => parseInt(id));
    whereClause.brand_id = { [Op.in]: brandIdArray };
  }

  try {
    const products = await BrandModel.findAll({
      where: whereClause,
      order: [["sort_order", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
