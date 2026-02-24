import api from "../../services/api";

const BASE = import.meta.env.VITE_API_URL;

// 🔓 Public blog list
export const getPublishedBlogs = () => {
  return api.get(`/api/blogs/public`);
};

// 🔓 Single blog by slug
export const getPublishedBlogBySlug = (slug) => {
  return api.get(`/api/blogs/public/${slug}`);
};
