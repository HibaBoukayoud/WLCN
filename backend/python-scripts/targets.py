import json
import numpy as np
from Classes.FileReader_class import fileReader
from tensorflow.keras.models import load_model

FR = fileReader()

def predict_targets(frame_index=0):
    # Usa il modello CNN per predire il numero di target in un frame Range-Doppler.
    # Il frame_index è lo stesso passato a doppler.py, così la prediction è sincronizzata con la visualizzazione.
    
    # Carica il modello
    model = load_model("modello_trained.h5")
    # Carica i dati
    filepath = 'C:\\Users\\hibab\\Desktop\\Dataset'
    name = '1_targets-2000_28Jul2025_14_31_03'
    data = FR.load_data(name, filepath)
    selected_frames = np.array(data['beforeClutterMitig']['RD_list'])
    frame = selected_frames[frame_index]
    # Preprocessing: aggiungi batch dimension e normalizza se necessario
    frame_input = np.expand_dims(frame, axis=0)  # shape: (1, 49, 64)
    if len(frame_input.shape) == 3:
        frame_input = np.expand_dims(frame_input, axis=-1)  # shape: (1, 49, 64, 1)
    frame_input = frame_input / np.max(frame_input)
    prediction = model.predict(frame_input)
    if prediction.shape[-1] == 1:
        num_targets = int(np.round(prediction[0, 0]))
    else:
        num_targets = int(np.argmax(prediction[0]))
    return {
        "frame_index": frame_index,
        "predicted_targets": num_targets
    }

if __name__ == "__main__":
    import sys
    try:
        frame_index = int(sys.argv[1]) if len(sys.argv) > 1 else 0
        result = predict_targets(frame_index=frame_index)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
