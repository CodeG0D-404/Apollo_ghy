// =============================================
// 📁 src/components/blog/BlogView.jsx
// Modern blog article layout — SEO optimized
// Magazine-style, reader-focused
// =============================================

import React from "react";
import "./CSS/BlogView.css";

export default function BlogView({ blog, showStatus = false }) {
  if (!blog) return null;

  const API_BASE = import.meta.env.VITE_API_URL || "";

  return (
    <article className="blog-view">

      {/* HEADER */}
      <header className="blog-header">

        <h1 className="blog-title">
          {blog.title}
        </h1>

        {/* META */}
        <div className="blog-meta">

          {showStatus && (
            <span
              className={`blog-status ${
                blog.status === "published"
                  ? "blog-status-published"
                  : "blog-status-draft"
              }`}
            >
              {blog.status}
            </span>
          )}

          <span className="blog-reading-time">
            {Math.max(2, Math.ceil((blog.content?.length || 0) / 900))} min read
          </span>

        </div>

      </header>

      {/* COVER IMAGE */}
      {blog.coverImage && (
        <div className="blog-cover">
          <img
          src={
              blog.coverImage.startsWith("http")
                ? blog.coverImage
                : `${API_BASE}/${blog.coverImage.replace(/^\/+/, "")}`
            }
            alt={blog.title}
            loading="lazy"
          />
        </div>
      )}

      {/* EXCERPT */}
      {blog.excerpt && (
        <p className="blog-excerpt">
          {blog.excerpt}
        </p>
      )}

      {/* CONTENT */}
      <section className="blog-content">
        {blog.content}
      </section>

      {/* FOOTER CTA */}
      <footer className="blog-footer">

        <div className="blog-share">
          <span>Share this article</span>
          <div className="blog-share-actions">

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                blog.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                blog.title + " " + window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>

          </div>
        </div>

      </footer>

    </article>
  );
}
