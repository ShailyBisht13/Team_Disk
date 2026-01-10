import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # FATAL only

import numpy as np
import joblib

try:
    import tensorflow as tf
    print(f"TensorFlow Version: {tf.__version__}")
    
    model_path = "iot_client/model.h5"
    
    # Try loading without compiling (often fixes optimizer mismatches)
    print("Attempting load with compile=False...")
    model = tf.keras.models.load_model(model_path, compile=False)
    print("✅ Model loaded (compile=False)")
    
    dummy_data = np.random.rand(1, 128, 6)
    pred = model.predict(dummy_data)
    print(f"Prediction result: {pred}")

except Exception as e:
    import traceback
    traceback.print_exc()
