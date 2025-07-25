import json
import numpy as np # Importa numpy per gestire array numerici e operazioni matematiche
import pyqtgraph as pg # Importa pyqtgraph per la visualizzazione grafica
from pyqtgraph import QtCore # Importa QtCore da pyqtgraph per gestire eventi e timer
from Classes.FileReader_class import fileReader; FR = fileReader() # Importa la classe fileReader per caricare i dati dai file


def extract_range_doppler(target_type=1, frame_index=0, max_frames=10):
    """
    Estrae dati Range-Doppler dal dataset
    
    Args:
        target_type: 0 per frame senza target, 1 per frame con target
        frame_index: indice del frame da cui iniziare (default: 0)
        max_frames: numero massimo di frame da restituire (default: 10)
    """
    filepath = 'C:\\Users\\hibab\\Dropbox\\HBoukayoud\\Codes\\Dataset\\0-2000_1-2000_targets-frames_04Mar2025_16_50_35'
    data = FR.load_data(filepath)
    
    # Seleziona il tipo di frame richiesto
    selected_frames = data[target_type]  # 0 = senza target, 1 = con target
    
    # Converte gli array NumPy in liste Python per la serializzazione JSON
    frames_to_return = []
    
    if isinstance(selected_frames, np.ndarray):
        if selected_frames.ndim == 3:  # Array 3D (frame, rows, cols)
            # Prendi solo i frame richiesti
            end_index = min(frame_index + max_frames, len(selected_frames))
            for i in range(frame_index, end_index):
                frames_to_return.append(selected_frames[i].tolist())
        elif selected_frames.ndim == 2:  # Array 2D (single frame)
            frames_to_return.append(selected_frames.tolist())

    return {
        "Range-Doppler Map": frames_to_return,
        "total_frames": len(frames_to_return),
        "target_type": target_type,
        "frame_start_index": frame_index,
        "available_frames": len(selected_frames) if isinstance(selected_frames, np.ndarray) and selected_frames.ndim == 3 else 1
    }

if __name__ == "__main__": # Questa riga assicura che il codice venga eseguito solo se il file è eseguito direttamente, e non se viene importato in un altro script
    rd_data = extract_range_doppler(target_type=1, frame_index=0, max_frames=5) # Chiama la funzione per estrarre solo 5 frame con 1 target (data[1])
    print(json.dumps(rd_data, indent=4)) # Stampa i dati estratti in formato JSON con indentazione per una migliore leggibilità
