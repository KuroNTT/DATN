const express = require("express");
const router = express.Router();
const GendersModel = require("../models/Gender");

router.get("/", async (req, res) => {
    try {
        const genders = await GendersModel.findAll();
        res.json(genders);
    } catch (error) {
        console.error("Lỗi khi lấy giới tính:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

/* Lấy theo id*/
router.get("/:id", async (req, res) => {
    const gender = await GendersModel.findByPk(req.params.id);
    res.json(gender);
});

module.exports = router;
