const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const authRoutes = require("./src/routes/auth"); // ✅ fix here
const userRoutes = require("./src/routes/users");
const hotelRoutes = require("./src/routes/hotels");
const hotelDetailsRoutes = require("./src/routes/hotelDetails");
const bookingRoutes = require("./src/routes/booking");
const errorHandler = require("./src/middleware/errorHandler");
const pool = require("./src/db/db");
const path = require("path");
const usersRoutes = require("./src/routes/users"); // Adjust based on your file structure

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use(morgan("dev"));

const testDbConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
testDbConnection();

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

// ✅ Use correct route handlers
app.use("/users", authRoutes);                     // ⬅️ Auth endpoints (register, login)
app.use("/hotels", hotelRoutes);                             // ⬅️ Hotels
app.use("/hotelDetails", hotelDetailsRoutes);            // ⬅️ Hotel details
app.use("/booking", bookingRoutes);                  // ⬅️ Bookings
app.use("/users", usersRoutes);                  // ⬅️ User profile, user list




// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




