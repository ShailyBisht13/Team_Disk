import numpy as np
import joblib
import os

# Try importing tensorflow. If not found, warn user (running on lightweight Pi?)
try:
    # Attempt import
    import tensorflow as tf
    TM_AVAILABLE = True
except Exception:
    # Catch importerrors and any other initialization crashes
    TM_AVAILABLE = False
    print("⚠️ TensorFlow could not be initialized. Running in Heuristic Mode.")

class VibrationClassifier:
    def __init__(self, model_path="model.h5", scaler_path="scaler.pkl"):
        """
        Load Keras model and Scikit-Learn scaler.
        """
        self.model = None
        self.scaler = None
        self.window_size = 128
        self.num_features = 6  # ax, ay, az, gx, gy, gz

        if not TM_AVAILABLE:
            return

        try:
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
                print("✅ Scaler Loaded")
            else:
                print(f"❌ Scaler file not found at {scaler_path}")

            if os.path.exists(model_path):
                # Try loading with compile=False to avoid optimizer version issues
                self.model = tf.keras.models.load_model(model_path, compile=False)
                print("✅ Vibration Model Loaded")
            else:
                print(f"❌ Model file not found at {model_path}")
        
        except Exception as e:
            print(f"⚠️ MODEL LOAD FAILED ({str(e)}). Switching to Heuristic Mode.")
            self.model = None  # Force fallback

    def predict(self, recent_data):
        """
        recent_data: List of 128 readings. Each reading is [ax, ay, az, gx, gy, gz].
        Returns: (is_pothole (bool), confidence (float))
        """
        if self.model is None or self.scaler is None:
            # Fallback simple heuristic provided in case model load fails
            # Just check if max Z-accel in window exceeds valid pothole threshold (apx 1.5g variance)
            z_values = [abs(x[2]) for x in recent_data]
            max_g = max(z_values) if z_values else 0
            if max_g > 15.0: # Matches the simulation "Spike" of 15.0
                 return True, 1.0
            return False, 0.0

        # 1. Convert to numpy array
        data_array = np.array(recent_data) # Shape should be (128, 6)

        if data_array.shape != (self.window_size, self.num_features):
            print(f"⚠️ Input shape mismatch. Expected ({self.window_size}, {self.num_features}), got {data_array.shape}")
            return False, 0.0

        # 2. Scale features
        # Scaler expects (N_samples, 6). 
        # Here N_samples = 128.
        scaled_data = self.scaler.transform(data_array)

        # 3. Reshape for CNN: (1, 128, 6)
        input_data = scaled_data.reshape(1, self.window_size, self.num_features)

        # 4. Predict
        try:
            prediction = self.model.predict(input_data, verbose=0)
            confidence = float(prediction[0][0]) # Sigmoid output 0-1
            
            # Label 1 = Pothole, Label 0 = Normal
            is_pothole = confidence > 0.5
            return is_pothole, confidence
            
        except Exception as e:
            print(f"Prediction Error: {e}")
            return False, 0.0
