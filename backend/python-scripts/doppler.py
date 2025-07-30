
import json
import numpy as np
from Classes.FileReader_class import fileReader
FR = fileReader()


def extract_range_doppler(frame_index=0):
    """
    Estrae un singolo frame Range-Doppler dal dataset.
    Args:
        target_type: 0 per frame senza target, 1 per frame con target
        frame_index: indice del frame da restituire
    """
    filepath = r'C:\Users\hibab\Desktop\Dataset'
    name='1_targets-2000_28Jul2025_14_31_03'
    data = FR.load_data(name, filepath)
    selected_frames = np.array(data['beforeClutterMitig']['RD_list'])
    # Gestione robusta: accetta sia np.ndarray che lista di frame
    return {
        "Range-Doppler Map": list(selected_frames[frame_index]),
        "total_frames": 1,
        "frame_index": frame_index,
        "available_frames": selected_frames.shape[0]
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
