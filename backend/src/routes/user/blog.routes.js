const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/user/blog.controller");

router.get("/", blogController.getAllBlogs);
router.get("/slug/:slug", blogController.getBlogBySlug);
router.get("/category/:slug", blogController.getBlogsByCategorySlug);
router.get("/categories/all", blogController.getAllBlogCategories);
router.get("/newest", blogController.getNewestBlog);
module.exports = router;
