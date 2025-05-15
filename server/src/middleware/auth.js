const jwt = require("jsonwebtoken");
const pool = require("../db/db");
require("dotenv").config();

const SECRET_KEY =
  process.env.JWT_SECRET || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0";

// Auth middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    req.userRole = decoded.role; // 👈 Add role to req (won't break anything)
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Forbidden: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    req.user = decoded; // Contains userId and role
    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = { verifyToken, isAdmin };
