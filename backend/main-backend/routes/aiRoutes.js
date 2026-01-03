import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { runAIDetection } from "../utils/aiProcessor.js";   // ✅ Correct path

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File Upload Handling
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),   // ✅ Correct uploads path
  filename: (req, file, cb) => {
    cb(null, "input_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/detect", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded"
      });
    }

    const inputPath = req.file.path;
    const result = await runAIDetection(inputPath);

    res.json({
      success: true,
      message: "AI detection completed",
      processedImage: result.outputImage,
      detections: result.detections,
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
