// =============================================
// 📁 src/clinic/BlogViewPage.jsx
// Admin: View Single Blog
// Scoped + Production Ready
// =============================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog, deleteBlog, updateBlog } from "./Services/blog.service";
import BlogView from "../components/BlogView";
import { toast } from "react-toastify";
import "./styles/BlogViewPage.css";

export default function BlogViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ----------------------------------
  // LOAD BLOG
  // ----------------------------------
  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlog(id);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  // ----------------------------------
  // TOGGLE STATUS
  // ----------------------------------
  const toggleStatus = async () => {
    const newStatus = blog.status === "draft" ? "published" : "draft";
    const fd = new FormData();
    fd.append("status", newStatus);

    try {
      setActionLoading(true);
      await updateBlog(blog._id, fd);
      setBlog((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Blog moved to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------
  // DELETE
  // ----------------------------------
  const remove = async () => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      setActionLoading(true);
      await deleteBlog(blog._id);
      toast.success("Blog deleted");
      navigate("/clinic/blogs");
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------
  // STATES
  // ----------------------------------
  if (loading) {
    return <div className="blog-view-state">Loading blog...</div>;
  }

  if (!blog) {
    return <div className="blog-view-state">Blog not found</div>;
  }

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <div className="blog-view-page">
      <div className="blog-view-card">
        <BlogView blog={blog} showStatus />

        {/* ACTION BAR */}
        <div className="blog-view-actions">
          <button
            className="blog-view-btn blog-view-primary"
            disabled={actionLoading}
            onClick={toggleStatus}
          >
            {blog.status === "draft" ? "Publish" : "Move to Draft"}
          </button>

          <button
            className="blog-view-btn blog-view-danger"
            disabled={actionLoading}
            onClick={remove}
          >
            Delete
          </button>

          <button
            className="blog-view-btn blog-view-neutral"
            onClick={() => navigate("/clinic/blogs")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
