const express = require("express");
const router = express.Router();
const SizeModel = require("../models/Size");


/* Lấy tất cả size */
router.get("/", async (req, res) => {
    const sizes = await SizeModel.findAll({
        order: [["id", "ASC"]],
    });
    res.json(sizes);
});

/* Lấy danh mục theo id*/
router.get("/:id", async (req, res) => {
    const size = await SizeModel.findByPk(req.params.id);
    res.json(size);
});

module.exports = router;
