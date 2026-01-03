from flask import Flask, request, jsonify
import tensorflow as tf
from satellite_model import analyze_satellite_image

app = Flask(__name__)

model = tf.keras.models.load_model("models/pothole_model.h5")

@app.post("/predict")
def predict():
    file = request.files["image"]
    image = tf.image.decode_image(file.read(), channels=3)
    image = tf.image.resize(image, (224, 224))
    image = image / 255.0
    image = tf.expand_dims(image, 0)

    prediction = model.predict(image)[0]
    response = {
        "type": "Pothole" if prediction[0] > 0.5 else "Good Road",
        "severity": "High" if prediction[0] > 0.7 else "Low",
        "confidence": str(prediction[0])
    }
    return jsonify(response)

app.run(port=7000, debug=True)
