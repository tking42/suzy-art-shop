const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/login
// Validates email and password, returns a signed JWT on success.
// The JWT payload includes the user's id and isAdmin flag, which the
// auth middleware uses to protect admin-only routes.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { login };
