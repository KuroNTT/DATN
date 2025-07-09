const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);



module.exports = router;
