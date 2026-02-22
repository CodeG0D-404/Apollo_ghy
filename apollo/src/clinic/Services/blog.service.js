// src/clinic/Services/blog.service.js
import adminAxios from "./adminAxios";

// =====================
// ADMIN BLOG SERVICES
// =====================

// Create blog
export const createBlog = (data) => {
  return adminAxios.post("/blogs", data);
};

// List blogs (draft + published)
export const getBlogs = (page = 1, limit = 10) => {
  return adminAxios.get(`/blogs?page=${page}&limit=${limit}`);
};

// Single blog (admin)
export const getBlog = (id) => {
  return adminAxios.get(`/blogs/${id}`);
};

// Update blog
export const updateBlog = (id, data) => {
  return adminAxios.put(`/blogs/${id}`, data);
};

// Delete blog
export const deleteBlog = (id) => {
  return adminAxios.delete(`/blogs/${id}`);
};
