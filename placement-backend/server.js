const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected...");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "placements",
    resource_type: "raw", // for PDFs, DOC, DOCX
    format: async (req, file) => file.originalname.split('.').pop()
  }
});
const upload = multer({ storage });

/* ------------------ FEEDBACK COLLECTION ------------------ */
const feedbackSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  fileURL: String,
  fileName: String
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.post("/api/feedback", upload.single("file"), async (req, res) => {
  const { companyName, text } = req.body;
  const fileURL = req.file ? req.file.path : null;
  const fileName = req.file ? req.file.originalname : null;

  if (!companyName || !text) {
    return res.status(400).send("Company name and feedback text are required");
  }

  try {
    const newFeedback = new Feedback({ companyName, text, fileURL, fileName });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ timestamp: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).send("Server Error");
  }
});

/* ------------------ PLACEMENTS COLLECTION ------------------ */
const placementSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  description: { type: String, required: true }, // updated to match frontend
  fileURL: String,
  fileName: String,
  timestamp: { type: Date, default: Date.now }
});

const Placement = mongoose.model("Placement", placementSchema);

app.post("/api/placements", upload.single("file"), async (req, res) => {
  const { companyName, description } = req.body;
  const fileURL = req.file ? req.file.path : null;
  const fileName = req.file ? req.file.originalname : null;

  if (!companyName || !description) {
    return res.status(400).send("Company name and description are required");
  }

  try {
    const newPlacement = new Placement({
      companyName,
      description,
      fileURL,
      fileName
    });
    await newPlacement.save();
    res.status(201).json(newPlacement);
  } catch (error) {
    console.error("Error saving placement:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/placements", async (req, res) => {
  try {
    const placements = await Placement.find().sort({ timestamp: -1 });
    res.json(placements);
  } catch (error) {
    console.error("Error fetching placements:", error);
    res.status(500).send("Server Error");
  }
});

/* ------------------ START SERVER ------------------ */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
