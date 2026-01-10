import UserReport from "../models/UserReport.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of backend (where server.js is)
const backendRoot = path.join(__dirname, "..", "..");

export const generateOrderPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await UserReport.findById(id);

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    const pdf = new PDFDocument({ margin: 50 });
    const filename = `Order_${report._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    pdf.pipe(res);

    // ---------------------------------------------------------
    // 🛠 HELPER: Get Disk Path
    // ---------------------------------------------------------
    const getDiskPath = (urlPath) => {
      if (!urlPath) return null;

      // 1. /uploads -> backend/uploads
      if (urlPath.startsWith("/uploads") || urlPath.includes("/uploads")) {
        // clean the path to be relative
        const rel = urlPath.split("/uploads")[1];
        const p = path.join(backendRoot, "uploads", rel);
        return p;
      }

      // 2. /ai-output -> backend/main-backend/ai/runs
      if (urlPath.startsWith("/ai-output")) {
        const rel = urlPath.replace("/ai-output", "");
        // join: backend/main-backend/ai/runs + rel
        const p = path.join(backendRoot, "main-backend", "ai", "runs", rel);
        return p;
      }

      return null;
    };


    // ---------------------------------------------------------
    // 📄 HEADER
    // ---------------------------------------------------------
    pdf.font("Helvetica-Bold").fontSize(14).text("Government of Uttarakhand", { align: "center" });
    pdf.fontSize(12).text("Public Works Department (PWD)", { align: "center" });
    pdf.text("Office of the Executive Engineer", { align: "center" });
    pdf.moveDown(0.5);

    pdf.font("Helvetica").fontSize(11);
    pdf.text("Division: ____________________  District: ____________________", { align: "center" });
    pdf.moveDown(1.5);

    // ---------------------------------------------------------
    // 📄 ORDER INFO
    // ---------------------------------------------------------
    const currentYear = new Date().getFullYear();
    const today = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

    pdf.text(`Order No.: PWD/ROAD/AI/${currentYear}/${report._id.toString().slice(-4)}`, { continued: true });
    pdf.text(`Date: ${today}`, { align: "right" });
    pdf.moveDown(1);

    pdf.font("Helvetica-Bold").fontSize(16).text("DIGITAL WORK ORDER", { align: "center", underline: true });
    pdf.moveDown(1);

    // ---------------------------------------------------------
    // 📄 BODY
    // ---------------------------------------------------------
    pdf.font("Helvetica-Bold").fontSize(11).text("Subject: ", { continued: true });
    pdf.font("Helvetica").text("Approval and Issuance of Work Order for Rectification of Reported Road Damage");
    pdf.moveDown(0.5);

    pdf.font("Helvetica-Bold").text("ORDER", { align: "center" });
    pdf.moveDown(0.5);

    pdf.font("Helvetica").text(
      "Whereas, a road damage complaint has been received through the AI-Based Road Damage Reporting and Monitoring Web Application, submitted by a citizen, and duly verified by the concerned authorities;\n\n" +
      "And whereas, upon inspection and technical verification by the Public Works Department (PWD), the reported damage has been found genuine and requiring immediate attention;\n\n" +
      "Now, therefore, in exercise of the powers conferred upon the undersigned, the said road damage is hereby approved, and a Digital Work Order is issued for the rectification of the same, as per the details given below:"
      , { align: "justify" });
    pdf.moveDown(1);


    // ---------------------------------------------------------
    // 📄 APPROVED WORK DETAILS
    // ---------------------------------------------------------
    pdf.font("Helvetica-Bold").text("Approved Work Details", { underline: true });
    pdf.moveDown(0.5);

    const startX = 50;

    const details = [
      ["Report ID:", report._id.toString()],
      ["Location:", report.address || "Unknown"],
      ["Road Name / Stretch:", report.description || "N/A"],
      ["District / Block:", "______________________"],
      ["Nature of Damage:", report.severity ? `${report.severity} Severity Damage` : "Pothole / Road Surface Defect"],
      ["Approximate Coordinates:", `Lat: ${report.lat}, Lng: ${report.lng}`],
      ["Date of Report:", new Date(report.createdAt).toLocaleDateString("en-GB")]
    ];

    details.forEach(([label, value]) => {
      pdf.font("Helvetica-Bold").text(label, { continued: true, width: 150 });
      pdf.font("Helvetica").text(` ${value}`);
      pdf.moveDown(0.3);
    });
    pdf.moveDown(1);

    // ---------------------------------------------------------
    // 📄 INSTRUCTIONS
    // ---------------------------------------------------------
    pdf.font("Helvetica-Bold").text("Scope of Work");
    pdf.font("Helvetica").text("The approved work shall include removal of damaged road surface, necessary surface preparation, filling, resurfacing, and restoration of the road to ensure safe and smooth vehicular movement.");
    pdf.moveDown(0.5);

    pdf.font("Helvetica-Bold").text("Execution Instructions");
    pdf.font("Helvetica")
      .text("1. The concerned Assistant Engineer / Junior Engineer is hereby directed to carry out the work as per departmental norms and specifications.")
      .text("2. The work shall be completed within _____ days from the date of issue of this order.")
      .text("3. Quality control and safety standards shall be strictly adhered to during execution.")
      .text("4. A completion report along with photographic evidence shall be uploaded on the digital platform upon completion of work.");
    pdf.moveDown(0.5);

    pdf.font("Helvetica-Bold").text("Monitoring & Compliance");
    pdf.font("Helvetica").text("The progress and completion of the work shall be monitored through the Digital Road Damage Monitoring System, and the status shall be updated as In-Progress and Resolved accordingly.");
    pdf.moveDown(2);

    // ---------------------------------------------------------
    // 📷 IMAGES (Bottom of Page or Next Page)
    // ---------------------------------------------------------
    if (pdf.y > 600) pdf.addPage();

    const aiPath = getDiskPath(report.aiImage);
    const userPath = getDiskPath(report.image);

    if (aiPath && fs.existsSync(aiPath)) {
      pdf.text("Technical Reference (AI Detection):", { underline: true });
      pdf.image(aiPath, { width: 400 });
      pdf.moveDown();
    } else if (userPath && fs.existsSync(userPath)) {
      pdf.text("Technical Reference (User Upload):", { underline: true });
      pdf.image(userPath, { width: 400 });
      pdf.moveDown();
    }

    if (pdf.y > 650) pdf.addPage();
    pdf.moveDown(2);

    // ---------------------------------------------------------
    // ✍ SIGNATURE
    // ---------------------------------------------------------
    pdf.text("This issues with the approval of the competent authority.", { align: "left" });
    pdf.moveDown(1);

    pdf.text("By Order and in the name of the Governor of", { align: "right" });
    pdf.font("Helvetica-Bold").text("Lieutenant General Gurmit Singh (Retd.)", { align: "right" });
    pdf.font("Helvetica").text("Executive Engineer", { align: "right" });
    pdf.text("Public Works Department (PWD)", { align: "right" });
    pdf.text("Division: ____________________", { align: "right" });

    // Finalize
    pdf.end();

  } catch (err) {
    console.error("PDF Generation Error:", err);
    res.status(500).json({ success: false, error: "PDF generation failed" });
  }
};
