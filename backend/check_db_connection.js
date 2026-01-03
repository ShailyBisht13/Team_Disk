import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

const uri = process.env.MONGO_URI;

console.log("-----------------------------------------");
console.log("🔍 DIAGNOSTIC: MongoDB Connection Check");
console.log("-----------------------------------------");

if (!uri) {
    console.error("❌ ERROR: MONGO_URI is missing from .env");
    process.exit(1);
}

// Mask password for display
const maskedUri = uri.replace(/:([^:@]+)@/, ":****@");
console.log("📡 Connecting to:", maskedUri);

mongoose.connect(uri)
    .then(() => {
        console.log("✅ SUCCESS: Connected to MongoDB successfully!");
        console.log("-----------------------------------------");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ CONNECTION FAILED");
        console.error("-----------------------------------------");
        console.error("Error Name:", err.name);
        console.error("Error Code:", err.code);
        console.error("Error CodeName:", err.codeName);
        console.error("Message:", err.message);
        console.log("-----------------------------------------");
        console.log("💡 TIP: 'bad auth' means Wrong Username or Password.");
        console.log("   Check MongoDB Atlas -> Database Access tab.");
        process.exit(1);
    });
