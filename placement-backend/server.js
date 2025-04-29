// server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const PlacementSchema = new mongoose.Schema({
  companyName: String,
  description: String,
  fileName: String,
  fileURL: String,
  timestamp: { type: Date, default: Date.now }
});
const Placement = mongoose.model("Placement", PlacementSchema);

// File storage with Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// POST API
app.post("/api/placements", upload.single("file"), async (req, res) => {
  try {
    const { companyName, description } = req.body;
    const fileURL = `http://localhost:5000/uploads/${req.file.filename}`;
    const newPlacement = await Placement.create({
      companyName,
      description,
      fileName: req.file.originalname,
      fileURL
    });
    res.status(201).json(newPlacement);
  } catch (err) {
    res.status(500).json({ message: "Error uploading placement", error: err.message });
  }
});

// GET API
app.get("/api/placements", async (req, res) => {
  try {
    const placements = await Placement.find().sort({ timestamp: -1 });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch placements" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
