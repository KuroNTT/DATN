const express = require("express");
const router = express.Router();
const BlogCategoryController = require("../../controllers/admin/blogCategory.controller");

router.get("/", BlogCategoryController.getAll);
router.post("/", BlogCategoryController.create);
router.put("/:id", BlogCategoryController.update);
router.delete("/:id", BlogCategoryController.remove);

module.exports = router;
