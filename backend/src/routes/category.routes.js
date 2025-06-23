const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/Category");

/* --------------------/ Categories /-------------------- */
/* Lấy tất cả danh mục */
router.get("/", async (req, res) => {
  const categories = await CategoryModel.findAll({
    where: { status: 1 },
    order: [["sort_order", "ASC"]],
  });
  res.json(categories);
});

/* Lấy danh mục theo id*/
router.get("/:id", async (req, res) => {
  const category = await CategoryModel.findByPk(req.params.id);
  res.json(category);
});

module.exports = router;
