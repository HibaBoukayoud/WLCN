
import json
import numpy as np
from Classes.FileReader_class import fileReader
FR = fileReader()

def extract_angle_range(target_type=1, frame_index=0):
    """
    Estrae un singolo frame Angle-Range dal dataset.
    Args:
        target_type: 0 per frame senza target, 1 per frame con target
        frame_index: indice del frame da restituire
    """
    filepath = 'C:\\Users\\hibab\\Dropbox\\HBoukayoud\\Codes\\Dataset\\0-2000_1-2000_targets-frames_04Mar2025_16_50_35'
    data = FR.load_data(filepath)
    selected_frames = data[target_type]
    # Gestione robusta: accetta sia np.ndarray che lista di frame
    if isinstance(selected_frames, np.ndarray):
        if selected_frames.ndim == 3:
            frame = selected_frames[frame_index].tolist()
            available = len(selected_frames)
        elif selected_frames.ndim == 2:
            frame = selected_frames.tolist()
            available = 1
        else:
            frame = []
            available = 0
    elif isinstance(selected_frames, list):
        if len(selected_frames) > 0 and isinstance(selected_frames[0], (np.ndarray, list)):
            frame = selected_frames[frame_index]
            if isinstance(frame, np.ndarray):
                frame = frame.tolist()
            available = len(selected_frames)
        else:
            frame = selected_frames
            available = 1
    else:
        frame = []
        available = 0
    return {
        "Angle-Range Map": frame,
        "total_frames": 1,
        "target_type": target_type,
        "frame_index": frame_index,
        "available_frames": available
    }

if __name__ == "__main__":
    import sys
    try:
        # Parametri da riga di comando: target_type, frame_index
        target_type = int(sys.argv[1]) if len(sys.argv) > 1 else 1
        frame_index = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        result = extract_angle_range(target_type=target_type, frame_index=frame_index)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
