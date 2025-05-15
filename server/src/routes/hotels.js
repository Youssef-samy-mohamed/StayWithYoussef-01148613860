const express = require("express");
const {
  verifyToken: authMiddleware,
  isAdmin: adminMiddleware,
} = require("../middleware/auth");
const pool = require("../db/db");
const path = require("path");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
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
      tags,
    } = req.body;

    const images = req.files?.images
      ? Array.isArray(req.files.images)
        ? req.files.images.map((file) => `/uploads/${file.name}`)
        : [`/uploads/${req.files.images.name}`]
      : [];

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

    // ✅ Don't include ID — let PostgreSQL auto-generate it
    const result = await pool.query(
      `INSERT INTO hotels 
        (name, description, address, location, images, check_in, check_out, cancellation_policy, amenities) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
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
      ]
    );

    const hotel = result.rows[0];

    // Insert rooms
    if (rooms && Array.isArray(rooms)) {
      for (const room of rooms) {
        await pool.query(
          `INSERT INTO rooms 
            (hotelId, type, bed_type, max_guests, price_per_night, currency, amenities, available) 
           VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8)`,
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

    // Insert tags
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
    for (const tagName of parsedTags) {
      let tagRes = await pool.query("SELECT * FROM tags WHERE name = $1", [
        tagName,
      ]);
      let tag = tagRes.rows[0];

      if (!tag) {
        const insertRes = await pool.query(
          "INSERT INTO tags (name) VALUES ($1) RETURNING *",
          [tagName]
        );
        tag = insertRes.rows[0];
      }

      await pool.query(
        "INSERT INTO hotel_tags (hotelId, tagId) VALUES ($1, $2)",
        [hotel.id, tag.id]
      );
    }

    res.status(201).json(hotel);
  } catch (error) {
    console.error("❌ Error adding hotel:", error);
    res.status(500).json({ error: error.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const { tag } = req.query;
    let hotelsQuery = `
      SELECT h.*
      FROM hotels h
    `;
    const values = [];
    let whereClause = "";

    if (tag) {
      whereClause = `
        JOIN hotel_tags ht ON h.id = ht.hotelId
        JOIN tags t ON ht.tagId = t.id
        WHERE t.name = $1
      `;
      values.push(tag);
      hotelsQuery += whereClause;
    }

    hotelsQuery += `
      ORDER BY h.createdAt DESC
    `;

    const hotelsResult = await pool.query(hotelsQuery, values);
    const hotels = hotelsResult.rows;

    for (let hotel of hotels) {
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
    }

    const totalQuery = `SELECT COUNT(*) FROM hotels h ${whereClause}`;
    const totalResult = await pool.query(totalQuery, values);
    const total = parseInt(totalResult.rows[0].count);

    res.json({ total, hotels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const hotelId = req.params.id;
    const {
      name,
      description,
      address,
      location,
      check_in,
      check_out,
      cancellation_policy,
      amenities,
      tags,
    } = req.body;

    const result = await pool.query(
      `UPDATE hotels SET 
        name = $1, 
        description = $2,
        address = $3,
        location = $4,
        check_in = $5,
        check_out = $6,
        cancellation_policy = $7,
        amenities = $8
       WHERE id = $9
       RETURNING *`,
      [
        name,
        description,
        address,
        location,
        check_in,
        check_out,
        cancellation_policy,
        JSON.stringify(amenities),
        hotelId,
      ]
    );

    const hotel = result.rows[0];

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Update tags
    await pool.query("DELETE FROM hotel_tags WHERE hotelId = $1", [hotelId]);

    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");

    for (const tagName of parsedTags) {
      let tagRes = await pool.query("SELECT * FROM tags WHERE name = $1", [
        tagName,
      ]);
      let tag = tagRes.rows[0];

      if (!tag) {
        const insertRes = await pool.query(
          "INSERT INTO tags (name) VALUES ($1) RETURNING *",
          [tagName]
        );
        tag = insertRes.rows[0];
      }

      await pool.query(
        "INSERT INTO hotel_tags (hotelId, tagId) VALUES ($1, $2)",
        [hotelId, tag.id]
      );
    }

    res.json(hotel);
  } catch (error) {
    console.error("❌ Error updating hotel:", error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
