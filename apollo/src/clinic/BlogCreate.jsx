// =============================================
// 📁 src/clinic/BlogCreate.jsx
// Admin: Create Blog (Scoped + Production Ready)
// =============================================

import { useState } from "react";
import { createBlog } from "./Services/blog.service";
import { toast } from "react-toastify";
import "./styles/BlogCreate.css";

export default function BlogCreate() {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setCoverImage(file || null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    if (!coverImage) {
      toast.error("Cover image is required");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("coverImage", coverImage);

    try {
      setLoading(true);
      await createBlog(fd);

      toast.success(
        form.status === "published"
          ? "Blog published successfully"
          : "Blog saved as draft"
      );

      // reset
      setForm({
        title: "",
        excerpt: "",
        content: "",
        status: "draft",
      });
      setCoverImage(null);
    } catch (err) {
      console.error("Create blog error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to save blog. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="blog-create-page">
      <div className="blog-create-card">
        <h2 className="blog-create-title">Add Blog</h2>

        <form className="blog-create-form" onSubmit={submit}>
          {/* TITLE */}
          <div className="blog-create-field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter blog title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* EXCERPT */}
          <div className="blog-create-field">
            <label>Excerpt</label>
            <textarea
              name="excerpt"
              rows="3"
              placeholder="Short summary (optional)"
              value={form.excerpt}
              onChange={handleChange}
            />
          </div>

          {/* CONTENT */}
          <div className="blog-create-field">
            <label>Content</label>
            <textarea
              name="content"
              rows="8"
              placeholder="Write blog content..."
              value={form.content}
              onChange={handleChange}
            />
          </div>

          {/* IMAGE + STATUS */}
          <div className="blog-create-row">
            <div className="blog-create-field">
              <label>Cover Image</label>
              <input type="file" accept="image/*" onChange={handleImage} />
            </div>

            <div className="blog-create-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
            </div>
          </div>

          {/* ACTION */}
          <button
            type="submit"
            className="blog-create-submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
