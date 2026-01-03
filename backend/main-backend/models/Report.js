import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  mobile: String,
  description: String,
  imageUrl: String,
  videoUrl: String,
  lat: Number,
  lng: Number,
  status: { type: String, default: "new" }, // new, assigned, in_progress, resolved
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  severity: { type: String, default: "unknown" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", ReportSchema);
