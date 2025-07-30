
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
    selected_frames = np.array(data['beforeClutterMitig']['RDA_list'])
    available = len(selected_frames)
    frame=selected_frames[frame_index]
    tmp = np.fft.fft(frame, axis=0)
    tmp = np.fft.fftshift(np.fft.fft(tmp, axis = 1), axes=1)
    tmp = np.fft.fftshift(np.fft.fft(tmp, axis = 2), axes=2)
    RDA = abs(tmp)
    RD = RDA.mean(axis=2)

    return {
        "Range-Doppler Map": RD.tolist(),
        "total_frames": available,
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
