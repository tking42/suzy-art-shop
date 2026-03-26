const Product = require("../models/Product");

// GET /api/products
// Returns all products sorted newest first. Public — used by the shop page.
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// GET /api/products/:id
// Returns a single product by its MongoDB ID. Public — used by the product page.
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// POST /api/products
// Creates a new product. Admin only.
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    const product = new Product({ name, description, price, stock, image });
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
};

// PUT /api/products/:id
// Updates an existing product by ID. Admin only.
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product", error: error.message });
  }
};

// DELETE /api/products/:id
// Deletes a product by ID. Admin only.
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
