const express = require("express");
const router = express.Router();
const blogCategoryController = require("../../controllers/admin/blogCategory.controller");

router.get("/", blogCategoryController.getAll);
router.get("/:id", blogCategoryController.getById);
router.post("/", blogCategoryController.create);
router.put("/:id", blogCategoryController.update);
router.delete("/:id", blogCategoryController.remove);

module.exports = router;
