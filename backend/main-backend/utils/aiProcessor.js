// main-backend/utils/aiProcessor.js

import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScript = path.join(__dirname, "..", "ai", "detect.py");

// ------------------------------------------------------------
// ⭐ SAFE AI PROCESSOR (Spawn Version)
// ------------------------------------------------------------
export const runAIDetection = (imagePath) => {
  // ------------------------------------------------------------
  // ⭐ 1. Convert relative path → absolute path
  // ------------------------------------------------------------
  const absPath = path.isAbsolute(imagePath)
    ? imagePath
    : path.join(process.cwd(), imagePath);

  console.log("📌 Using Absolute Image Path for AI:", absPath);

  return new Promise((resolve, reject) => {
    // Spawn Python process
    const process = spawn("python", ["-u", pythonScript, absPath]);

    let outputData = "";
    let errorData = "";

    // Collect stdout
    process.stdout.on("data", (data) => {
      const chunk = data.toString();
      outputData += chunk;
      console.log(`[Python Output]: ${chunk.trim()}`);
    });

    // Collect stderr (for debug logs from Python)
    process.stderr.on("data", (data) => {
      const chunk = data.toString();
      errorData += chunk;
      console.error(`[Python Debug]: ${chunk.trim()}`);
    });

    // Handle process close
    process.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);

      if (code !== 0) {
        return resolve({
          detections: [],
          outputImage: absPath,
          aiResult: `AI process failed (Code ${code})`
        });
      }

      // ------------------------------------------------------------
      // ⭐ 2. Extract JSON safely from gathered output
      // ------------------------------------------------------------
      const lines = outputData.split("\n");
      let jsonLine = null;

      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("{") && line.endsWith("}")) {
          jsonLine = line;
          // We assume the LAST valid JSON line is the result if there are multiple, 
          // or just the first valid one we find. 
          // Let's break on the first one that looks like our result or keep looking if safe.
          // Since our script prints only one JSON at the end, finding one is good.
        }
      }

      if (!jsonLine) {
        console.error("❌ No JSON found in Python output.");
        return resolve({
          detections: [],
          outputImage: absPath,
          aiResult: "AI failed (No JSON outcome)"
        });
      }

      try {
        const parsed = JSON.parse(jsonLine);

        // Handle "error" key from Python JSON if present
        if (parsed.error) {
          return resolve({
            detections: [],
            outputImage: absPath,
            aiResult: `AI internal error: ${parsed.error}`
          });
        }

        return resolve({
          detections: parsed.detections || [],
          outputImage: parsed.outputImage || parsed.output_image || absPath,
          aiResult: "AI success",
        });

      } catch (err) {
        console.error("❌ JSON Parse Error:", err.message);
        return resolve({
          detections: [],
          outputImage: absPath,
          aiResult: "AI failed (JSON Parse Error)",
        });
      }
    });

    // Handle spawn errors (e.g., python not found)
    process.on("error", (err) => {
      console.error("❌ Failed to start subprocess:", err);
      return resolve({
        detections: [],
        outputImage: absPath,
        aiResult: `AI Spawn Failed: ${err.message}`
      });
    });
  });
};
