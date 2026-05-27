import tensorflow as tf

print("TensorFlow version:", tf.__version__)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(10, activation='relu', input_shape=(3,)),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy')

print("✅ Modelo creado correctamente")
