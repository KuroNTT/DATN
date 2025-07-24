const BlogModel = require("../../models/Blog");
const UserModel = require("../../models/User");
const BlogCategoryModel = require("../../models/BlogCategory");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: BlogCategoryModel,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await BlogModel.findByPk(req.params.id, {
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: BlogCategoryModel,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy bài viết", error });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, thumbnail, author_id, category_id } =
      req.body;

    const newBlog = await BlogModel.create({
      title,
      slug,
      content,
      thumbnail,
      author_id,
      category_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    res.status(500).json({ message: "Lỗi khi tạo bài viết", error });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, thumbnail, author_id, category_id } =
      req.body;

    const blog = await BlogModel.findByPk(id);
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    await blog.update({
      title,
      slug,
      content,
      thumbnail,
      author_id,
      category_id,
      updated_at: new Date(),
    });

    res.json({ message: "Cập nhật thành công", blog });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật bài viết", error });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findByPk(id);
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    await blog.destroy();
    res.json({ message: "Đã xoá bài viết thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá bài viết", error });
  }
};
