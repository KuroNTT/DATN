const express = require("express");
const router = express.Router();
const BrandModel = require("../models/Brand");
const ProductModel = require("../models/Product");

/* Lấy tất cả hãng */
// router.get("/", async (req, res) => {
//     const brands = await BrandModel.findAll({
//         where: { status: 1 },
//         order: [["sort_order", "ASC"]],
//     });
//     res.json(brands);
// });

/* Lấy danh mục theo id*/
// router.get("/:id", async (req, res) => {
//     const brand = await BrandModel.findByPk(req.params.id);
//     res.json(brand);
// });



// test
const { Op } = require("sequelize");

// Lấy danh sách sản phẩm, lọc theo brandIds nếu có
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


