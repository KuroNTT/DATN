const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/category.controller");

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.remove);

module.exports = router;
