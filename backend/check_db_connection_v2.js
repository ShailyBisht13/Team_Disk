import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const uri = process.env.MONGO_URI;
const runID = Date.now();

console.log(`[${runID}] 🔍 CONNECTION TEST START`);
console.log(`[${runID}] 📡 URI: ${uri ? uri.replace(/:([^:@]+)@/, ":****@") : "MISSING"}`);

if (!uri) process.exit(1);

mongoose.connect(uri)
    .then(() => {
        console.log(`[${runID}] ✅ SUCCESS! Connected.`);
        process.exit(0);
    })
    .catch((err) => {
        console.log(`[${runID}] ❌ FAILED: ${err.message}`);
        process.exit(1);
    });
