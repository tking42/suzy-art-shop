const express = require("express");
const { getProducts, getProduct, createProduct } = require("../controllers/productController");
const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET single product by id
router.get("/:id", getProduct);

// POST new product (admin)
router.post("/", createProduct);

module.exports = router;