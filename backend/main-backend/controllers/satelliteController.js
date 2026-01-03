import { fetchSentinelImage } from "../../geospatial-service/sentinel_api.js";

export const getSatelliteAnalysis = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const imageUrl = await fetchSentinelImage(lat, lng);

    res.json({
      success: true,
      imageUrl,
      damageType: "Landslide",
      severity: "High",
      confidence: "82%"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
