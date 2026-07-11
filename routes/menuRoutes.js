const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");
const Menu = require("../models/Menu");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

///////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////
const normalizeHostel = (h) => h.toLowerCase().trim();

const normalizeMeal = (m) => m.toLowerCase().trim();

///////////////////////////////////////////////////////////////
// UPLOADS SETUP
///////////////////////////////////////////////////////////////
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

///////////////////////////////////////////////////////////////
// GET TODAY MENUS
///////////////////////////////////////////////////////////////
router.get("/today", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const menus = await Menu.find({
      menuDate: { $gte: start, $lte: end },
    }).lean();

    res.json({ success: true, data: menus });
  } catch (err) {
    console.error("Fetch menus error:", err);
    res.status(500).json({ success: false, error: "Fetch failed" });
  }
});

///////////////////////////////////////////////////////////////
// ADD MENU ITEM
///////////////////////////////////////////////////////////////
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    let { hostel, mealType, singleItem, createdBy } = req.body;

    if (!hostel || !mealType || !singleItem) {
      return res.status(400).json({
        success: false,
        error: "hostel, mealType, singleItem required",
      });
    }

    hostel = normalizeHostel(hostel);
    mealType = normalizeMeal(mealType);

    const menuDate = new Date();
    menuDate.setHours(0, 0, 0, 0);

    const day = menuDate.toLocaleDateString("en-US", { weekday: "long" });

    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      text: singleItem,
      createdBy: createdBy || "Anonymous",
      createdAt: new Date(),
      ownerToken: crypto.randomUUID(),
    };

    if (req.file) {
      newItem.imagePath = `/uploads/${req.file.filename}`;
      newItem.thumbPath = newItem.imagePath;
    }

    const menu = await Menu.findOneAndUpdate(
      {
        hostel,
        mealType,
        menuDate: {
          $gte: menuDate,
          $lt: new Date(menuDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        $setOnInsert: {
          hostel,
          mealType,
          menuDate,
          day,
          status: "published",
        },
        $push: { items: newItem },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    console.log("✅ Menu updated:", hostel, mealType);

    res.json({ success: true, data: menu });
  } catch (err) {
    console.error("Save menu error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
