const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
require("dotenv").config();
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

// Middleware to validate request body
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema(req.body || req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Validation schemas
const registerSchema = (body) => {
  const { firstName, lastName, email, password } = body;
  if (!firstName || typeof firstName !== "string" || firstName.length > 50) {
    return {
      error: {
        details: [
          {
            message:
              "First name is required and must be a string under 50 characters",
          },
        ],
      },
    };
  }
  if (!lastName || typeof lastName !== "string" || lastName.length > 50) {
    return {
      error: {
        details: [
          {
            message:
              "Last name is required and must be a string under 50 characters",
          },
        ],
      },
    };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: { details: [{ message: "Valid email is required" }] } };
  }
  if (!password || password.length < 8) {
    return {
      error: {
        details: [{ message: "Password must be at least 8 characters long" }],
      },
    };
  }
  return { error: null };
};

const loginSchema = (body) => {
  const { email, password } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: { details: [{ message: "Valid email is required" }] } };
  }
  if (!password) {
    return { error: { details: [{ message: "Password is required" }] } };
  }
  return { error: null };
};

// Register new user
router.post("/register", validateRequest(registerSchema), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING id, firstName, lastName, email",
      [firstName, lastName, email, hashedPassword]
    );

    const user = newUser.rows[0];
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Login user
router.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Admin Routes
router.get("/", isAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, role FROM users");
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.patch("/:id", isAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { role } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING *",
      [role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Get all users
router.get("/users", isAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: error.message });
  }
});

// Delete user by ID
router.delete("/:id", isAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
