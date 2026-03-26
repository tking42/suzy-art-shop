const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only
router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
