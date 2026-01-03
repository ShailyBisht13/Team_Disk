import UserReport from "../models/UserReport.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");
const publicDir = path.join(__dirname, ".."); // Parent of controllers

export const generateOrderPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await UserReport.findById(id);

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    const pdf = new PDFDocument();
    const filename = `Order_${report._id}.pdf`;
    const filePath = path.join(uploadDir, filename);

    // Helpers to get disk path from URL
    const getDiskPath = (urlPath) => {
      if (!urlPath) return null;
      // Remove leading slash if exists to join correctly
      const relative = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
      // Assuming 'uploads/...' is at root level of server process or relative to public dir
      // If url is "/uploads/file.jpg", publicDir join needs to match where that folder actually is relative to cwd
      return path.join(publicDir, relative);
    };

    pdf.pipe(fs.createWriteStream(filePath));
    pdf.pipe(res);

    // Header
    pdf.fontSize(20).text("DIGITAL WORK ORDER", { align: "center" });
    pdf.moveDown();

    // Report Info
    pdf.fontSize(12).text(`Report ID: ${report._id}`);
    pdf.text(`Mobile: ${report.mobile}`);
    pdf.text(`Status: ${report.status}`);
    pdf.text(`Description: ${report.description}`);
    pdf.text(`Address: ${report.address}`);
    pdf.text(`Coordinates: ${report.lat}, ${report.lng}`);
    pdf.moveDown();

    // Severity
    const damageCount = report.aiLabels?.length || 0;
    let severity = "No Damage";
    if (damageCount >= 7) severity = "High";
    else if (damageCount >= 3) severity = "Medium";
    else if (damageCount >= 1) severity = "Low";

    pdf.text(`Severity Level: ${severity}`, { underline: true });
    pdf.moveDown();

    // Google Maps link
    pdf.fillColor("blue")
      .text("View on Google Maps", {
        link: `https://www.google.com/maps?q=${report.lat},${report.lng}`,
      });
    pdf.fillColor("black");
    pdf.moveDown();

    // Images
    const imgPath = getDiskPath(report.image);
    if (imgPath && fs.existsSync(imgPath)) {
      pdf.text("Uploaded Image:");
      try {
        pdf.image(imgPath, { width: 250 });
      } catch (e) {
        pdf.text("(Image Error)");
      }
      pdf.moveDown();
    }

    const aiImgPath = getDiskPath(report.aiImage);
    if (aiImgPath && fs.existsSync(aiImgPath)) {
      pdf.text("AI Processed Image:");
      try {
        pdf.image(aiImgPath, { width: 250 });
      } catch (e) {
        pdf.text("(Image Error)");
      }
      pdf.moveDown();
    }

    // Instructions
    pdf.fontSize(14).text("Work Instructions:", { underline: true });
    pdf.fontSize(12).text(
      "• Visit the site and inspect the road damage.\n" +
      "• Take measurements of pothole dimensions.\n" +
      "• Ensure safety while repairing.\n" +
      "• Submit final before/after photos.\n"
    );
    pdf.moveDown();

    // Signature area
    pdf.text("Authorized By: __________________");
    pdf.text("Date: __________________");

    // Finalize PDF
    pdf.end();

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "PDF generation failed" });
  }
};
