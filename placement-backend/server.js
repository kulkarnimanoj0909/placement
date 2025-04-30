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

// Cloudinary storage for multer (handling file uploads to Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "placements", // Files will be stored in the 'placements' folder on Cloudinary
    resource_type: "raw", // Handle raw files (like PDF, DOCX, etc.)
    format: async (req, file) => file.originalname.split('.').pop() // Keep the original file extension
  }
});
const upload = multer({ storage });

// MongoDB schema for Feedbacks
const feedbackSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true, // Making companyName required
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  fileURL: String,  // Storing file URL from Cloudinary
  fileName: String   // Storing the file name
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// POST API for feedback submission (including file upload and company name)
app.post("/api/feedback", upload.single("file"), async (req, res) => {
  const { companyName, text } = req.body;
  const fileURL = req.file ? req.file.path : null;
  const fileName = req.file ? req.file.originalname : null;

  if (!companyName || !text) {
    return res.status(400).send("Company name and feedback text are required");
  }

  try {
    const newFeedback = new Feedback({
      companyName,
      text,
      fileURL,
      fileName
    });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).send("Server Error");
  }
});

// GET API to fetch all feedbacks (including file URLs and company names)
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ timestamp: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
