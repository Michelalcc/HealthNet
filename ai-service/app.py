from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__)

# si ya tienes modelo model = tf.keras.models.load_model("model.h5")

def preprocess(img_path):
    img = Image.open(img_path).resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["image"]
    path = "temp.jpg"
    file.save(path)

    img = preprocess(path)

    pred = model.predict(img)[0][0]

    resultado = "Sin hallazgos"
    if pred > 0.6:
        resultado = "Alto riesgo"
    elif pred > 0.3:
        resultado = "Moderado"

    return jsonify({
        "probabilidad": float(pred),
        "resultado": resultado
    })

if __name__ == "__main__":
    app.run(port=5000)