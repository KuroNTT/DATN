const Blog = require("../../models/Blog");
const BlogCategoryModel = require("../../models/BlogCategory");
const UserModel = require("../../models/User");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: {
        is_published: 1,
        status: 1,
      },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: BlogCategoryModel,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "id",
        "title",
        "thumbnail",
        "content",
        "created_at",
        "category_id",
        "author_id",
      ],
      attributes: [
        "id",
        "title",
        "slug",
        "thumbnail",
        "content",
        "created_at",
        "category_id",
      ],
    });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/blogs/slug/:slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        slug: req.params.slug,
        is_published: 1,
        status: 1,
      },
      include: [
        {
          model: BlogCategoryModel,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!blog) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết theo slug" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/blogs/category/:slug
exports.getBlogsByCategorySlug = async (req, res) => {
  try {
    const category = await BlogCategoryModel.findOne({
      where: { slug: req.params.slug, status: 1 },
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    const blogs = await Blog.findAll({
      where: {
        category_id: category.id,
        is_published: 1,
        status: 1,
      },
      include: [
        {
          model: BlogCategoryModel,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/blogcategories (load sidebar filter)
exports.getAllBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategoryModel.findAll({
      where: { status: 1 },
      order: [["sort_order", "ASC"]],
      attributes: ["id", "name", "slug"],
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewestBlog = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      attributes: [
        "id",
        "title",
        "slug",
        "thumbnail",
        "content",
        "sort_order",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
      limit: 4,
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
