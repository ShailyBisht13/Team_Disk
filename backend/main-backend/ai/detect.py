import sys
import os
import json
from ultralytics import YOLO

# Ensure YOLO save folder exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RUNS_DIR = os.path.join(BASE_DIR, "runs", "detect")

os.makedirs(RUNS_DIR, exist_ok=True)

def main():
    print("DEBUG: Python Script Starting...", file=sys.stderr)
    # Input image path from Node.js
    if len(sys.argv) < 2:
        print("DEBUG: No arguments provided", file=sys.stderr)
        return

    input_path = sys.argv[1]
    print(f"DEBUG: Processing {input_path}", file=sys.stderr)

    try:
        # Load YOLO model
        print("DEBUG: Loading Model...", file=sys.stderr)
        model_path = os.path.join(BASE_DIR, "model", "best.pt")
        if not os.path.exists(model_path):
             print("DEBUG: best.pt not found, using yolov8n.pt", file=sys.stderr)
             model_path = "yolov8n.pt"
        
        model = YOLO(model_path)
        print("DEBUG: Model Loaded. Running Predict...", file=sys.stderr)

        # Run detection with lower confidence
        results = model.predict(
            source=input_path,
            save=True,
            project=RUNS_DIR,
            name="predict",
            exist_ok=True,
            verbose=False,
            conf=0.1
        )
        print("DEBUG: Prediction Done.", file=sys.stderr)

        detections = []
        for r in results[0].boxes:
            detections.append({
                "class": int(r.cls),
                "confidence": float(r.conf)
            })

        # Calculate correct output path (YOLOv8 standard)
        filename = os.path.basename(input_path)
        output_image_path = os.path.join(RUNS_DIR, "predict", filename)

        # Print JSON ONLY
        print(json.dumps({
            "detections": detections,
            "outputImage": output_image_path
        }))
        print("DEBUG: JSON Output Sent.", file=sys.stderr)

    except Exception as e:
        print(f"DEBUG: Error occurred: {str(e)}", file=sys.stderr)
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    main()
