const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const router = express.Router();

// Rate limiter to limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});

// Validation schema
const registerValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// REGISTER
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const defaultRole = "user";

      const newUser = await pool.query(
        `INSERT INTO users (firstName, lastName, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, firstName, lastName, email, role`,
        [firstName, lastName, email, hashedPassword, defaultRole]
      );
      const user = newUser.rows[0];

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "48h" }
      );

      res.status(201).json({
        accessToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// LOGIN
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        accessToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// CHECK IF EMAIL EXISTS
router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    res.json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
