const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogsAdmin,
  getAllBlogsPublic,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog
} = require("../controller/blog.controller");

const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/multer");
const validate = require("../middleware/validate");

const {
  createBlogSchema,
  updateBlogSchema,
  idParamSchema
} = require("../validators/blog.validator");

// ===================
// PUBLIC
// ===================
router.get("/public", getAllBlogsPublic);
router.get("/public/:slug", getBlogBySlug);

// ===================
// ADMIN
// ===================

router.get(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  getBlogById
);

router.get("/", verifyToken, getAllBlogsAdmin);

router.post(
  "/",
  verifyToken,
  upload.single("coverImage"),
  validate(createBlogSchema),
  createBlog
);

router.put(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  upload.single("coverImage"),
  validate(updateBlogSchema),
  updateBlog
);

router.delete(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  deleteBlog
);

module.exports = router;
