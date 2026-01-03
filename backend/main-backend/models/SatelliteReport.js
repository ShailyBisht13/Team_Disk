import mongoose from "mongoose";

const satelliteReportSchema = new mongoose.Schema({
  imageUrl: String,
  source: String,
  location: {
    lat: Number,
    lng: Number
  },
  damageType: String,
  severity: String,
  confidence: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("SatelliteReport", satelliteReportSchema);
