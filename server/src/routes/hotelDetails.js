// backend/src/routes/hotelDetails.js
const express = require("express");
const { verifyToken: authMiddleware, isAdmin: adminMiddleware } = require("../middleware/auth"); // ✅ Modified import
const pool = require("../db/db");
const path = require("path");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [
      req.params.id,
    ]);
    const hotel = result.rows[0];

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const roomsResult = await pool.query(
      "SELECT * FROM rooms WHERE hotelId = $1",
      [hotel.id]
    );
    hotel.rooms = roomsResult.rows;

    const tagsResult = await pool.query(
      `
      SELECT t.*
      FROM tags t
      JOIN hotel_tags ht ON t.id = ht.tagId
      WHERE ht.hotelId = $1
      `,
      [hotel.id]
    );
    hotel.tags = tagsResult.rows;

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      location,
      check_in,
      check_out,
      cancellation_policy,
      amenities,
      rooms,
    } = req.body;
    const hotelResult = await pool.query("SELECT * FROM hotels WHERE id = $1", [
      req.params.id,
    ]);
    const hotel = hotelResult.rows[0];

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const images = req.files?.images
      ? Array.isArray(req.files.images)
        ? req.files.images.map((file) => `/uploads/${file.name}`)
        : [`/uploads/${req.files.images.name}`]
      : JSON.parse(hotel.images);
    if (req.files?.images) {
      if (Array.isArray(req.files.images)) {
        req.files.images.forEach((file) =>
          file.mv(path.join(__dirname, "../../uploads", file.name))
        );
      } else {
        req.files.images.mv(
          path.join(__dirname, "../../uploads", req.files.images.name)
        );
      }
    }

    const updatedHotel = await pool.query(
      "UPDATE hotels SET name = $1, description = $2, address = $3, location = $4, images = $5, check_in = $6, check_out = $7, cancellation_policy = $8, amenities = $9 WHERE id = $10 RETURNING *",
      [
        name,
        description,
        address,
        location,
        JSON.stringify(images),
        check_in,
        check_out,
        cancellation_policy,
        JSON.stringify(amenities),
        req.params.id,
      ]
    );
    const newHotel = updatedHotel.rows[0];

    if (rooms && Array.isArray(rooms)) {
      await pool.query("DELETE FROM rooms WHERE hotelId = $1", [hotel.id]);
      for (const room of rooms) {
        await pool.query(
          "INSERT INTO rooms (hotelId, type, bed_type, max_guests, price_per_night, currency, amenities, available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [
            hotel.id,
            room.type,
            room.bed_type,
            room.max_guests,
            room.price_per_night,
            room.currency,
            JSON.stringify(room.amenities),
            room.available,
          ]
        );
      }
    }

    if (req.body.tags) {
      await pool.query("DELETE FROM hotel_tags WHERE hotelId = $1", [hotel.id]);
      const tagNames = Array.isArray(req.body.tags)
        ? req.body.tags
        : JSON.parse(req.body.tags);
      for (const tagName of tagNames) {
        let tagResult = await pool.query("SELECT * FROM tags WHERE name = $1", [
          tagName,
        ]);
        let tag = tagResult.rows[0];

        if (!tag) {
          tagResult = await pool.query(
            "INSERT INTO tags (name) VALUES ($1) RETURNING *",
            [tagName]
          );
          tag = tagResult.rows[0];
        }

        await pool.query(
          "INSERT INTO hotel_tags (hotelId, tagId) VALUES ($1, $2)",
          [hotel.id, tag.id]
        );
      }
    }

    res.json(newHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const hotelResult = await pool.query("SELECT * FROM hotels WHERE id = $1", [
      req.params.id,
    ]);
    const hotel = hotelResult.rows[0];

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    await pool.query("DELETE FROM hotel_tags WHERE hotelId = $1", [hotel.id]);
    await pool.query("DELETE FROM rooms WHERE hotelId = $1", [hotel.id]);
    await pool.query("DELETE FROM hotels WHERE id = $1", [hotel.id]);
    res.json({ message: "Hotel deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;