import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;

// 🔓 Public blog list
export const getPublishedBlogs = () => {
  return axios.get(`${BASE}/api/blogs/public`);
};

// 🔓 Single blog by slug
export const getPublishedBlogBySlug = (slug) => {
  return axios.get(`${BASE}/api/blogs/public/${slug}`);
};
