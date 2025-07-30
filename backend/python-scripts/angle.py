
import json
import numpy as np
from Classes.FileReader_class import fileReader
FR = fileReader()


import json
import numpy as np
from Classes.FileReader_class import fileReader
FR = fileReader()

def extract_angle_range(frame_index=0):
    """
    Estrae un singolo frame Angle-Range dal dataset.
    Args:
        frame_index: indice del frame da restituire
    """
    filepath = r'C:\Users\hibab\Desktop\Dataset'
    name = '1_targets-2000_28Jul2025_14_31_03'
    data = FR.load_data(name, filepath)
    selected_frames = np.array(data['beforeClutterMitig']['RDA_list'])
    RA = np.mean(selected_frames, axis=2)
    d=0
    return {
        "Angle-Range Map": RA[frame_index].tolist(),
        "total_frames": 1,
        "frame_index": frame_index,
        "available_frames": selected_frames.shape[0]
    }

if __name__ == "__main__":
    import sys
    try:
        frame_index = int(sys.argv[1]) if len(sys.argv) > 1 else 0
        result = extract_angle_range(frame_index=frame_index)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
