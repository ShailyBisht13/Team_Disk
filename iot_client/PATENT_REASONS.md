# Patent & Uniqueness Claims
## Title: Intelligent Pothole Detection System with Sensor-Image Fusion

### 1. Multi-Modal Sensor Fusion
Unlike traditional systems that rely solely on Computer Vision (which fails at night) or Vibration Sensors (which trigger false positives on speed bumps), our method uses a **Fusion Veto System**:
- The **MPU6050 vibration signature** acts as the primary trigger.
- The **YOLOv8 Vision Model** acts as the validator.
- GPS data correlates multiple reports to rule out sensor noise.

### 2. Edge-Cloud Hybrid Architecture
- **Latency reduction**: Immediate "Impact" warnings are processed on the Edge (Raspberry Pi) using lightweight LSTM.
- **Accuracy**: Heavy image processing is offloaded to the Cloud/Server only when an event is validated, saving bandwidth and cost.

### 3. Verification Loop
- Incorporates a "Feedback Loop" where the central dashboard can re-train the Edge models based on Admin corrections, creating a self-improving fleet of detectors.
