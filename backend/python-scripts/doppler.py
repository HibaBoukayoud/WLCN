
import json
import numpy as np
from Classes.FileReader_class import fileReader
FR = fileReader()


def extract_range_doppler(target_type=1, frame_index=0):
    """
    Estrae un singolo frame Range-Doppler dal dataset.
    Args:
        target_type: 0 per frame senza target, 1 per frame con target
        frame_index: indice del frame da restituire
    """
    filepath = r'C:\Users\hibab\Desktop\Dataset'
    name='1_targets-2000_28Jul2025_14_31_03'
    data = FR.load_data(name, filepath)
    target_type = [int(name[0])]
    selected_frames = np.array(data['beforeClutterMitig']['RD_list'])
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
        "Range-Doppler Map": frame,
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
        result = extract_range_doppler(target_type=target_type, frame_index=frame_index)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
