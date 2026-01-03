import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import Report from "../models/Report.js";

const router = express.Router();

// list reports with optional status/limit/filter
router.get("/", authAdmin, async (req, res) => {
  const { status, limit = 100 } = req.query;
  const q = status ? { status } : {};
  const reports = await Report.find(q).sort({ createdAt: -1 }).limit(Number(limit));
  res.json({ success: true, reports });
});

// assign a report to admin or change status
router.patch("/:id/assign", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body; // assignedTo could be admin id
    const update = {};
    if (status) update.status = status;
    if (assignedTo) update.assignedTo = assignedTo;
    const r = await Report.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, report: r });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// simple endpoint to change status
router.patch("/:id/status", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const r = await Report.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, report: r });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
