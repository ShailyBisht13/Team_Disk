import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import UserReport from "./main-backend/models/UserReport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

const uri = process.env.MONGO_URI;

const deleteReports = async () => {
    if (!uri) {
        console.error("❌ ERROR: MONGO_URI is missing from .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");

        // Fetch all reports sorted by newest first (same as UI)
        const reports = await UserReport.find().sort({ createdAt: -1 });

        console.log(`📊 Total Reports Found: ${reports.length}`);

        if (reports.length < 2) {
            console.log("⚠️ Not enough reports to delete (Need at least 2).");
            process.exit(0);
        }

        // User wants to delete Report 2 through 14
        // Report 1 is index 0.
        // Report 2 is index 1.
        // Report 14 is index 13.

        // Slice returns a new array selected from start to end (end not included)
        // so slice(1, 14) gets indices 1, 2, ..., 13.
        // This corresponds to Report 2, 3, ..., 14.
        const reportsToDelete = reports.slice(1, 14);

        if (reportsToDelete.length === 0) {
            console.log("⚠️ No reports found in the target range (2-14).");
            process.exit(0);
        }

        console.log(`🗑️ Deleting ${reportsToDelete.length} reports...`);

        const idsToDelete = reportsToDelete.map(r => r._id);

        const result = await UserReport.deleteMany({ _id: { $in: idsToDelete } });

        console.log(`✅ Successfully deleted ${result.deletedCount} reports.`);
        console.log("---------------------------------------------------");
        reportsToDelete.forEach((r, i) => {
            console.log(`[Deleted] Report #${i + 2}: ${r.description} (ID: ${r._id})`);
        });

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected");
        process.exit(0);
    }
};

deleteReports();
