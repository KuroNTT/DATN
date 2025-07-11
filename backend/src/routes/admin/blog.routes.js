const express = require("express");
const router = express.Router();
const BlogController = require("../../controllers/admin/blog.controller");

router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);
router.post("/", BlogController.createBlog);
router.put("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);

module.exports = router;
