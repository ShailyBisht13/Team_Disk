import time
import requests
import json
import os
import cv2  # OpenCV for camera
import random  # For simulation if sensors missing

# Configuration
BACKEND_URL = "http://localhost:5000/api/reports/upload-damage"  # Change to your PC IP if on Pi (e.g. 192.168.1.X)
MOBILE_NUMBER = "9999999999"  # Registered user
DEVICE_ID = "RPI_01"

# Thresholds
VIBRATION_THRESHOLD = 1.5  # G-force variance
MIN_INTERVAL = 5  # Seconds between reports

# Mock Libraries if not on Pi
try:
    from mpu6050 import mpu6050
    mpu = mpu6050(0x68)
    print("✅ MPU6050 Connected")
except ImportError:
    mpu = None
    print("⚠️ MPU6050 Not found (Simulating)")

def get_gps():
    # Placeholder for real GPS (e.g., via serial/pynmea2)
    # Return (lat, lng)
    return (28.6139, 77.2090) # New Delhi

def get_vibration():
    if mpu:
        data = mpu.get_accel_data()
        return data['z'] # Vertical acceleration
    else:
        return 1.0 + random.uniform(-0.1, 0.1) + (5.0 if random.random() < 0.01 else 0)

def capture_image(filename="event.jpg"):
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    if ret:
        cv2.imwrite(filename, frame)
    cam.release()
    return filename if ret else None

def main():
    print(f"🚀 Pothole Detection Client Started. Sending to {BACKEND_URL}")
    
    last_event = 0
    
    while True:
        z_accel = get_vibration()
        
        # Simple Z-axis anomaly detection
        # In real LSTM, you'd collect a window of 50 samples and pass to model
        if abs(z_accel - 1.0) > VIBRATION_THRESHOLD:
            now = time.time()
            if now - last_event > MIN_INTERVAL:
                print(f"❗ IMPACT DETECTED! G={z_accel:.2f}")
                last_event = now
                
                # 1. Capture Image
                img_path = capture_image()
                if not img_path:
                    print("❌ Camera failed")
                    continue
                
                # 2. Get Location
                lat, lng = get_gps()
                
                # 3. Upload
                try:
                    files = {'image': open(img_path, 'rb')}
                    data = {
                        'mobile': MOBILE_NUMBER,
                        'description': f"Auto-detected Pothole (G={z_accel:.1f})",
                        'lat': lat,
                        'lng': lng,
                        'address': "GPS Location",
                        'sensorType': 'Pothole'
                    }
                    
                    print("📤 Uploading report...")
                    res = requests.post(BACKEND_URL, data=data, files=files)
                    print(f"✅ Server Response: {res.status_code}")
                    if res.status_code == 200:
                        print(res.json())
                except Exception as e:
                    print(f"❌ Upload Failed: {e}")
                
        time.sleep(0.1)

if __name__ == "__main__":
    main()
