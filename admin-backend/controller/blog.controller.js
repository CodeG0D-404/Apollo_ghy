const Blog = require("../models/Blog");
const slugify = require("slugify");
const uploadToCloudinary = require("../services/cloudinaryUpload"); // 🔥 added

// ==============================
// CREATE BLOG (Admin)
// ==============================
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    // 🔥 CLOUDINARY UPLOAD
    let coverImageUrl = null;
    try {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      coverImageUrl = result.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ message: "Image upload failed" });
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      coverImage: coverImageUrl,
      status: status ? status.toLowerCase() : "draft",
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};


// ==============================
// GET ALL BLOGS (Admin)
// Draft + Published
// ==============================
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error("Fetch admin blogs error:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


// ==============================
// GET ALL PUBLISHED BLOGS (Public)
// ==============================
exports.getAllBlogsPublic = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .select("title slug excerpt coverImage createdAt");

    res.json(blogs);
  } catch (error) {
    console.error("Fetch public blogs error:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// ==============================
// GET SINGLE BLOG BY ID (Admin)
// ==============================
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Fetch blog by id error:", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};


// ==============================
// GET SINGLE BLOG BY SLUG (Public)
// ==============================
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Fetch blog error:", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};


// ==============================
// UPDATE BLOG (Admin)
// ==============================
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    const updateData = {
      content,
      excerpt,
      status: status?.toLowerCase(),
    };

    if (title) {
      let slug = slugify(title, { lower: true, strict: true });

      const slugExists = await Blog.findOne({
        slug,
        _id: { $ne: req.params.id },
      });

      if (slugExists) slug = `${slug}-${Date.now()}`;

      updateData.title = title;
      updateData.slug = slug;
    }

    // 🔥 CLOUDINARY IMAGE UPDATE
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "blogs");
        updateData.coverImage = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};


// ==============================
// DELETE BLOG (Admin)
// ==============================
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};