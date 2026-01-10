import time
import requests
import json
import os
import cv2
import random
import numpy as np
from vibration_classifier import VibrationClassifier

# Configuration
BACKEND_URL = "http://localhost:5000/api/reports/upload-damage"
MOBILE_NUMBER = "9999999999"
DEVICE_ID = "RPI_01"
MIN_INTERVAL = 5  # Seconds between reports

# Initialize AI Model
classifier = VibrationClassifier("model.h5", "scaler.pkl")

# Mock Libraries if not on Pi
try:
    from mpu6050 import mpu6050
    mpu = mpu6050(0x68)
    print("✅ MPU6050 Connected")
except ImportError:
    mpu = None
    print("⚠️ MPU6050 Not found (Simulating)")

def get_gps():
    return (28.6139, 77.2090) # Placeholder

def get_sensor_data():
    """Returns [ax, ay, az, gx, gy, gz]"""
    if mpu:
        accel = mpu.get_accel_data()
        gyro = mpu.get_gyro_data()
        return [accel['x'], accel['y'], accel['z'], gyro['x'], gyro['y'], gyro['z']]
    else:
        # Simulation
        # Normal driving vibration
        ax = random.uniform(-0.5, 0.5)
        ay = random.uniform(-0.5, 0.5)
        az = 9.8 + random.uniform(-0.5, 0.5) # Gravity + noise
        gx = random.uniform(-1, 1)
        gy = random.uniform(-1, 1)
        gz = random.uniform(-1, 1)
        
        # Occasional pothole spike (simulated)
        if random.random() < 0.005: 
            az = 15.0 # Spike
            print("🌊 [SIMULATION] Generating Pothole Spike!")

        return [ax, ay, az, gx, gy, gz]

def capture_image(filename="event.jpg"):
    cam = cv2.VideoCapture(0)
    # Warmup
    time.sleep(0.1)
    ret, frame = cam.read()
    if ret:
        cv2.imwrite(filename, frame)
    cam.release()
    return filename if ret else None

def main():
    print(f"🚀 AI Pothole Client Started.")
    print(f"📡 Backend: {BACKEND_URL}")
    
    last_event = 0
    window = []
    WINDOW_SIZE = 128

    while True:
        # 1. Collect Data
        data_point = get_sensor_data() # [ax, ay, az, gx, gy, gz]
        window.append(data_point)

        # Maintain sliding window
        if len(window) > WINDOW_SIZE:
            window.pop(0)

        # 2. Inference (only when window fills)
        if len(window) == WINDOW_SIZE:
            # Run Model
            is_pothole, confidence = classifier.predict(window)
            
            # Additional logic: Check current Z spike to avoid continuous firing even if window is 'bad'
            current_z = abs(data_point[2])
            
            if is_pothole:
                now = time.time()
                if now - last_event > MIN_INTERVAL:
                    print(f"❗ POTHOLE DETECTED! Conf={confidence:.2f}")
                    last_event = now
                    
                    # Capture & Upload
                    img_path = capture_image()
                    if img_path:
                        lat, lng = get_gps()
                        try:
                            # Send to Backend
                            with open(img_path, 'rb') as f:
                                files = {'image': f}
                                payload = {
                                    'mobile': MOBILE_NUMBER,
                                    'description': f"AI Detected Pothole (Conf: {confidence:.2f})",
                                    'lat': lat,
                                    'lng': lng,
                                    'address': "IoT Device",
                                    'sensorType': 'Vibration-CNN'
                                }
                                print("📤 Uploading...")
                                res = requests.post(BACKEND_URL, data=payload, files=files)
                                print(f"✅ Upload Status: {res.status_code}")
                        except Exception as e:
                            print(f"❌ Upload Error: {e}")
        
        # Sampling Rate (Approx 50Hz -> 0.02s delay)
        time.sleep(0.02)

if __name__ == "__main__":
    main()
