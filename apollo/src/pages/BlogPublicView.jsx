import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogView from "../components/BlogView";
import { getPublishedBlogBySlug } from "./services/publicBlog.service";

export default function BlogPublicView() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedBlogBySlug(slug)
      .then((res) => setBlog(res.data))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  return <BlogView blog={blog} />;
}
