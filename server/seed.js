const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data (optional, comment out if you want to keep existing)
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Create demo user
    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@shop.com",
      password: "password123", // will be hashed automatically
      isAdmin: true
    });

    // Create sample products
    const products = [
      {
        name: "T-shirt",
        description: "Cool cotton T-shirt",
        price: 25,
        stock: 10,
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Mug",
        description: "Ceramic coffee mug",
        price: 12,
        stock: 20,
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Notebook",
        description: "Lined notebook for notes",
        price: 8,
        stock: 15,
        image: "https://via.placeholder.com/150"
      }
    ];

    await Product.insertMany(products);

    console.log("✅ Seed data inserted successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);