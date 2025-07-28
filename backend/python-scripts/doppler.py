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
    
    # Gestione robusta: accetta sia np.ndarray che lista di frame
    if isinstance(selected_frames, np.ndarray):
        if selected_frames.ndim == 3:
            # Se max_frames == 1 restituisci solo il frame richiesto (2D)
            if max_frames == 1:
                frame = selected_frames[frame_index].tolist()
                return {
                    "Range-Doppler Map": frame,
                    "total_frames": 1,
                    "target_type": target_type,
                    "frame_start_index": frame_index,
                    "available_frames": len(selected_frames)
                }
            else:
                frames_to_return = []
                end_index = min(frame_index + max_frames, len(selected_frames))
                for i in range(frame_index, end_index):
                    frames_to_return.append(selected_frames[i].tolist())
                return {
                    "Range-Doppler Map": frames_to_return,
                    "total_frames": len(frames_to_return),
                    "target_type": target_type,
                    "frame_start_index": frame_index,
                    "available_frames": len(selected_frames)
                }
        elif selected_frames.ndim == 2:
            frame = selected_frames.tolist()
            return {
                "Range-Doppler Map": frame,
                "total_frames": 1,
                "target_type": target_type,
                "frame_start_index": frame_index,
                "available_frames": 1
            }
    elif isinstance(selected_frames, list):
        # Se è una lista di frame (tipico dopo serializzazione con dill)
        if len(selected_frames) > 0 and isinstance(selected_frames[0], (np.ndarray, list)):
            if max_frames == 1:
                # Un solo frame richiesto
                frame = selected_frames[frame_index]
                if isinstance(frame, np.ndarray):
                    frame = frame.tolist()
                return {
                    "Range-Doppler Map": frame,
                    "total_frames": 1,
                    "target_type": target_type,
                    "frame_start_index": frame_index,
                    "available_frames": len(selected_frames)
                }
            else:
                frames_to_return = []
                end_index = min(frame_index + max_frames, len(selected_frames))
                for i in range(frame_index, end_index):
                    frame = selected_frames[i]
                    if isinstance(frame, np.ndarray):
                        frame = frame.tolist()
                    frames_to_return.append(frame)
                return {
                    "Range-Doppler Map": frames_to_return,
                    "total_frames": len(frames_to_return),
                    "target_type": target_type,
                    "frame_start_index": frame_index,
                    "available_frames": len(selected_frames)
                }
        else:
            # Lista 2D (un solo frame)
            frame = selected_frames
            return {
                "Range-Doppler Map": frame,
                "total_frames": 1,
                "target_type": target_type,
                "frame_start_index": frame_index,
                "available_frames": 1
            }

if __name__ == "__main__":
    import sys
    try:
        # Parametri da riga di comando: target_type, frame_index, max_frames
        target_type = int(sys.argv[1]) if len(sys.argv) > 1 else 1
        frame_index = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        max_frames = int(sys.argv[3]) if len(sys.argv) > 3 else 1
        result = extract_range_doppler(target_type=target_type, frame_index=frame_index, max_frames=max_frames)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
