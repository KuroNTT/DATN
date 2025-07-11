const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/user/blog.controller");

/* router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById); */

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.get("/category/:slug", blogController.getBlogsByCategorySlug);
router.get("/categories/all", blogController.getAllBlogCategories);

module.exports = router;
