const express = require("express");
const pool = require("../db/db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Validation function
const validateBooking = (body) => {
  const { userId, hotelId, roomType, checkInDate, checkOutDate, hotelName } =
    body;
  if (!userId || typeof userId !== "number") {
    return {
      error: { details: [{ message: "Valid userId (number) is required" }] },
    };
  }
  if (!hotelId || typeof hotelId !== "number") {
    // Changed from "string" to "number"
    return {
      error: { details: [{ message: "Valid hotelId (number) is required" }] },
    };
  }
  if (!roomType || typeof roomType !== "string") {
    return { error: { details: [{ message: "Room type is required" }] } };
  }
  if (!checkInDate || isNaN(new Date(checkInDate).getTime())) {
    return {
      error: { details: [{ message: "Valid check-in date is required" }] },
    };
  }
  if (!checkOutDate || isNaN(new Date(checkOutDate).getTime())) {
    return {
      error: { details: [{ message: "Valid check-out date is required" }] },
    };
  }
  if (new Date(checkInDate) >= new Date(checkOutDate)) {
    return {
      error: {
        details: [{ message: "Check-out date must be after check-in date" }],
      },
    };
  }
  return { error: null };
};
// Middleware to validate requests
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema(req.body);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Get all bookings for the authenticated user
// Get all bookings (for admins)
router.get("/", verifyToken, async (req, res) => {
  try {
    // Check if the user is an admin
    const isAdmin = req.userRole === 'admin';  // Assuming userRole is set after JWT verification
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const result = await pool.query("SELECT * FROM bookings");
    const bookings = result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      hotelId: row.hotel_id,
      hotelName: row.hotel_name,
      room: { type: row.room_type },
      checkInDate: row.check_in_date,
      checkOutDate: row.check_out_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new booking
router.post(
  "/",
  verifyToken,
  validateRequest(validateBooking),
  async (req, res) => {
    try {
      const {
        userId,
        hotelId,
        hotelName,
        roomType,
        checkInDate,
        checkOutDate,
        pricePerNight,
        totalPrice,
      } = req.body;

      console.log("Received booking data:", {
        userId,
        hotelId,
        hotelName,
        roomType,
        checkInDate,
        checkOutDate,
        pricePerNight,
        totalPrice,
      });

      if (userId !== req.userId) {
        console.log("Create booking: User ID mismatch", {
          userId,
          reqUserId: req.userId,
        });
        return res
          .status(403)
          .json({ error: "Unauthorized: User ID mismatch" });
      }

      const userResult = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [userId]
      );
      if (userResult.rows.length === 0) {
        console.log("Create booking: User not found", userId);
        return res.status(404).json({ error: "User not found" });
      }

      const hotelResult = await pool.query(
        "SELECT id FROM hotels WHERE id = $1",
        [hotelId]
      );
      if (hotelResult.rows.length === 0) {
        console.log("Create booking: Hotel not found", hotelId);
        return res.status(404).json({ error: "Hotel not found" });
      }

      const overlapResult = await pool.query(
        `SELECT id FROM bookings WHERE hotel_id = $1 AND room_type = $2 AND check_in_date < $4 AND check_out_date > $3`,
        [hotelId, roomType, checkInDate, checkOutDate]
      );
      if (overlapResult.rows.length > 0) {
        console.log("Create booking: Room already booked", {
          hotelId,
          roomType,
        });
        return res
          .status(409)
          .json({ error: "Room is already booked for the selected dates" });
      }

      const result = await pool.query(
        `INSERT INTO bookings (user_id, hotel_id, hotel_name, room_type, check_in_date, check_out_date, price_per_night, total_price, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, user_id, hotel_id, hotel_name, room_type, check_in_date, check_out_date, price_per_night, total_price, created_at, updated_at`,
        [
          userId,
          hotelId,
          hotelName || null,
          roomType,
          checkInDate,
          checkOutDate,
          pricePerNight,
          totalPrice,
        ]
      );

      const newBooking = result.rows[0];
      console.log("Create booking: Success, booking ID:", newBooking.id);
      res.status(201).json({
        id: newBooking.id,
        userId: newBooking.user_id,
        hotelId: newBooking.hotel_id,
        hotelName: newBooking.hotel_name,
        room: { type: newBooking.room_type },
        checkInDate: newBooking.check_in_date,
        checkOutDate: newBooking.check_out_date,
        pricePerNight: newBooking.price_per_night,
        totalPrice: newBooking.total_price,
        createdAt: newBooking.created_at,
        updatedAt: newBooking.updated_at,
      });
    } catch (error) {
      console.error("Booking creation error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete a booking by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId;
    const userRole = req.userRole; // make sure this is set in your middleware
    console.log(
      `Delete booking request: booking ID ${id}, user ID ${userId}, role ${userRole}`
    );

    const bookingResult = await pool.query(
      "SELECT user_id FROM bookings WHERE id = $1",
      [id]
    );

    if (bookingResult.rows.length === 0) {
      console.log(`Delete booking: Booking ID ${id} not found`);
      return res.status(404).json({ error: "Booking not found" });
    }

    const bookingUserId = bookingResult.rows[0].user_id;

    // Allow deletion if user is admin or owner of booking
    if (userRole !== "admin" && bookingUserId !== userId) {
      console.log("Delete booking: Unauthorized", { userId, bookingUserId });
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own bookings" });
    }

    await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
    console.log(`Delete booking: Success, booking ID ${id} deleted`);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Delete booking error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
