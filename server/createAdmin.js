// Run once to create the admin user:
//   node createAdmin.js
//
// Set ADMIN_EMAIL and ADMIN_PASSWORD below before running.
// The password will be hashed automatically before saving.

const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

const ADMIN_EMAIL = "admin@teaandcakeproductions.com";
const ADMIN_PASSWORD = "Password";
const ADMIN_NAME = "Admin";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    isAdmin: true,
  });

  console.log(`Admin created: ${ADMIN_EMAIL}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
