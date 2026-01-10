# 🛠️ IoT Device Setup Guide for Road Damage Detection

This guide details how to build the hardware device, connect components, and understand the AI Architecture.

---

## 1. Hardware Requirements

| Component | Purpose | Recommended Model |
| :--- | :--- | :--- |
| **Raspberry Pi** | Main Controller (The "Brain") | Raspberry Pi 4 Model B (4GB or 8GB RAM) |
| **Camera Module** | Capture road images | Raspberry Pi Camera Module V2 or USB Webcam |
| **Accelerometer** | Detect vibrations/shocks | **MPU6050** (Gyro + Accelerometer) |
| **GPS Module** | Get coordinates (Lat/Lng) | **NEO-6M** GPS Module |
| **MicroSD Card** | OS Storage | 32GB Class 10 |
| **Power Supply** | Power the Pi in Car | 5V 3A USB-C Car Charger / Power Bank |
| **Jumper Wires** | Connections | Female-to-Female & Male-to-Female |

### 🛑 Crucial Extras
*   **Car Mount/Case**: The device MUST be rigidly mounted to the car dashboard. If it's loose, the specific vibration of a pothole will be lost in the noise of the device shaking.

---

## 2. Wiring Guide (GPIO Connections)

### A. MPU6050 (Accelerometer) -> Raspberry Pi
*   **VCC** -> 3.3V (Pin 1)
*   **GND** -> GND (Pin 6)
*   **SDA** -> GPIO 2 (Pin 3)
*   **SCL** -> GPIO 3 (Pin 5)

### B. NEO-6M (GPS) -> Raspberry Pi
*   **VCC** -> 5V (Pin 4)
*   **GND** -> GND (Pin 6 or other GND)
*   **TX** -> GPIO 15 (RXD) (Pin 10)
*   **RX** -> GPIO 14 (TXD) (Pin 8)

*(Note: GPS TX goes to Pi RX, and GPS RX goes to Pi TX)*

---

## 3. The Two-Model AI Architecture

You need to train **TWO** separate AI models for a complete system.

### 🧠 Model 1: Vibration Detection (The "Trigger")
*   **Where it runs:** On the Raspberry Pi (Edge).
*   **Input:** Z-axis accelerometer data (e.g., last 50 readings).
*   **Function:** Detects the *physics* of a pothole impact. It acts as a trigger to say "We hit something!".
*   **Why here?** Accelerometer data is too fast to send to the server. It must be processed instantly.
*   **Suggested Algorithm:** **Random Forest Classifier** or **1D-CNN**.
    *   *Simple version:* Threshold-based (If G-force > 2.0g).

### 👁️ Model 2: Visual Verification (The "Validator")
*   **Where it runs:** On the Backend Server (Cloud/PC).
*   **Input:** The image captured by the camera when Model 1 triggered.
*   **Function:** Verifies if the impact was actually a pothole or just a speed bump/rough patch.
*   **Why here?** Image processing is heavy. Running YOLO on a Pi is possible but slow; running it on a powerful backend server is faster and more accurate.
*   **Current Status:** You already have this! (**YOLOv8** `best.pt` file).

---

## 4. How it Works (The Workflow)

1.  **Sensing:** The MPU6050 continuously measures vibration (e.g., 50 times/sec).
2.  **Triggering:** **Model 1** analyzes these vibrations.
    *   *If Pothole Impact Detected:*
3.  **Capture:** The Camera immediately snaps a photo.
4.  **Enrich:** The Script gets current Lat/Lng from the GPS module.
5.  **Upload:** The Image + GPS location is sent to your Backend Server API.
6.  **Verification:** The Backend receives the image and runs **Model 2** (YOLOv8).
    *   *If YOLO sees a pothole:* It flags "Critical Damage" and saves it.
    *   *If YOLO sees nothing:* It might be discarded or flagged as a false positive.

---

## 5. Next Steps for You
1.  **Buy the hardware** listed above.
2.  **Wire it up** using the guide.
3.  **Install Libraries** on Pi:
    ```bash
    pip install mpu6050-raspberrypi pynmea2 requests opencv-python
    ```
4.  **Run the Client Script**: Use the `iot_client` scripts provided in this project.
