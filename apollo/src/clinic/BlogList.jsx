import { useEffect, useState } from "react";
import { getBlogs, deleteBlog, updateBlog } from "./Services/blog.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./styles/BlogList.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBlogs();
  }, [page]);

  const loadBlogs = async () => {
    try {
      setLoading(true);

      const res = await getBlogs(page);
      const data = res.data;

      setBlogs(Array.isArray(data) ? data : data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (blog) => {
    const newStatus = blog.status === "draft" ? "published" : "draft";
    const fd = new FormData();
    fd.append("status", newStatus);

    try {
      setLoadingId(blog._id);
      await updateBlog(blog._id, fd);

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog._id ? { ...b, status: newStatus } : b
        )
      );

      toast.success(`Blog ${newStatus}`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      setLoadingId(id);
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete blog");
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return <p className="blog-list-state">Loading blogs...</p>;
  }

  if (!blogs.length) {
    return <p className="blog-list-state">No blogs found.</p>;
  }

  return (
    <div className="blog-list-page">

      <h2 className="blog-list-title">Blogs</h2>

      <div className="blog-list-table-wrapper">
        <table className="blog-list-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th className="blog-list-actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((b) => (
              <tr key={b._id}>
                <td className="blog-list-title-cell">{b.title}</td>

                <td className="blog-list-status-cell">
                  <span
                    className={`blog-list-badge ${
                      b.status === "published"
                        ? "blog-list-badge-published"
                        : "blog-list-badge-draft"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td>
                  <div className="blog-list-actions">
                    <button
                      disabled={loadingId === b._id}
                      onClick={() => toggleStatus(b)}
                      className="blog-list-btn blog-list-primary"
                    >
                      {loadingId === b._id
                        ? "Updating..."
                        : b.status === "draft"
                        ? "Publish"
                        : "Draft"}
                    </button>

                    <button
                      disabled={loadingId === b._id}
                      onClick={() => remove(b._id)}
                      className="blog-list-btn blog-list-danger"
                    >
                      Delete
                    </button>

                    <Link to={`/clinic/blogs/${b._id}`}>
                      <button
                        disabled={loadingId === b._id}
                        className="blog-list-btn blog-list-view"
                      >
                        View
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="blog-list-pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="blog-list-btn"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="blog-list-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
