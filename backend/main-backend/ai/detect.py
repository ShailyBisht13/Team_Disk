import sys
import os
import json
import cv2
from ultralytics import YOLO

# Ensure YOLO save folder exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RUNS_DIR = os.path.join(BASE_DIR, "runs", "detect")
PREDICT_DIR = os.path.join(RUNS_DIR, "predict")

os.makedirs(PREDICT_DIR, exist_ok=True)

def is_video(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    return ext in ['.mp4', '.avi', '.mov', '.mkv', '.webm']

def main():
    print("DEBUG: Python Script Starting...", file=sys.stderr)
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
        print("DEBUG: Model Loaded.", file=sys.stderr)

        detections = []
        output_image_path = ""

        if is_video(input_path):
            print("DEBUG: Video detected. Processing frames manually...", file=sys.stderr)
            
            cap = cv2.VideoCapture(input_path)
            if not cap.isOpened():
                raise Exception("Could not open video file.")
            
            # Setup Video Writer
            width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps    = cap.get(cv2.CAP_PROP_FPS) or 30.0
            
            filename = os.path.basename(input_path)
            # Force .mp4 output for web compatibility
            output_filename = os.path.splitext(filename)[0] + "_out.mp4"
            output_image_path = os.path.join(PREDICT_DIR, output_filename)
            
            # Try H.264 (avc1) first, fallback to mp4v
            fourcc = cv2.VideoWriter_fourcc(*'avc1')
            writer = cv2.VideoWriter(output_image_path, fourcc, fps, (width, height))
            
            if not writer.isOpened():
                print("DEBUG: avc1 failed, trying mp4v...", file=sys.stderr)
                fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                writer = cv2.VideoWriter(output_image_path, fourcc, fps, (width, height))

            if not writer.isOpened():
                 raise Exception("Could not initialize VideoWriter with avc1 or mp4v.")

            frame_count = 0
            while True:
                success, frame = cap.read()
                if not success:
                    break
                
                frame_count += 1
                
                # Predict on frame
                results = model.predict(frame, verbose=False, conf=0.1)
                
                # Aggregate stats
                for r in results:
                    for box in r.boxes:
                        detections.append({
                            "class": int(box.cls),
                            "confidence": float(box.conf)
                        })
                
                # Plot and write
                annotated_frame = results[0].plot()
                writer.write(annotated_frame)
                
                if frame_count % 30 == 0:
                     print(f"DEBUG: Processed {frame_count} frames...", file=sys.stderr)

            cap.release()
            writer.release()
            print("DEBUG: Video processing done.", file=sys.stderr)

        else:
            print("DEBUG: Image detected. Processing single frame manually...", file=sys.stderr)
            
            # Read image
            img = cv2.imread(input_path)
            if img is None:
                raise Exception("Could not read image file.")

            # Predict
            results = model.predict(img, verbose=False, conf=0.1)
            
            # Aggregate stats
            for r in results:
                for box in r.boxes:
                    detections.append({
                        "class": int(box.cls),
                        "confidence": float(box.conf)
                    })
            
            # Plot
            annotated_img = results[0].plot()
            
            # Resolve output path
            filename = os.path.basename(input_path)
            output_image_path = os.path.join(PREDICT_DIR, filename)
            
            # Save manually
            cv2.imwrite(output_image_path, annotated_img)
            
            print("DEBUG: Image processed and saved.", file=sys.stderr)

        # -----------------------------------------------
        # Final cleanup and JSON
        # -----------------------------------------------
        
        # Limit detections
        if len(detections) > 100:
             detections = sorted(detections, key=lambda x: x['confidence'], reverse=True)[:100]

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
