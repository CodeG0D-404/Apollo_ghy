import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Css/Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/blogs/public`)
      .then((res) => setBlogs(res.data))
      .catch(() => console.error("Failed to load blogs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="center">Loading blogs...</p>;

  return (
    <div className="blogs-page">
      <div className="container">
        <h1 className="page-title">Health Articles & Updates</h1>

        <div className="blogs-grid">
          {blogs.map((blog) => (
            <Link
              key={blog.slug}
              to={`/blogs/${blog.slug}`}
              className="blog-card"
            >
              <img
                src={
                  blog.coverImage
                    ? blog.coverImage.startsWith("http")
                      ? blog.coverImage
                      : `${import.meta.env.VITE_API_URL}/${blog.coverImage.replace(/^\/+/, "")}`
                    : "/default-blog.png"
                }
                alt={blog.title}
              />

              <div className="blog-card-body">
                <h3>{blog.title}</h3>
                {blog.excerpt && <p>{blog.excerpt}</p>}
                <span className="read-more">Read More →</span>
              </div>
            </Link>
          ))}
        </div>

        {!blogs.length && (
          <p className="center">No blogs published yet.</p>
        )}
      </div>
    </div>
  );
}
