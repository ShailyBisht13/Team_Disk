import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    mobile: String,
    description: String,
    lat: Number,
    lng: Number,
    address: String,

    image: String,
    video: String,

    aiImage: String,
    aiLabels: Array,
    aiResult: String,

    status: {
      type: String,
      default: "Pending",
    },
    severity: String,
    sensorType: String,
  },
  { timestamps: true }
);

export default mongoose.model("UserReport", reportSchema);
