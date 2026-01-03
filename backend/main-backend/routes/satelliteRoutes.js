import express from "express";
import { getSatelliteAnalysis } from "../controllers/satelliteController.js";

const router = express.Router();

router.get("/analyze", getSatelliteAnalysis);

export default router;
