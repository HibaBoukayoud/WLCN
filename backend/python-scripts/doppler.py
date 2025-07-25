import numpy as np
import json

def generate_heatmap_data():
    # Genera una matrice 5x5 di dati casuali
    dati = np.random.rand(5, 5).tolist()
    
    return {
        "data": dati,
        "title": "Heatmap",
        "color_map": "hot"
    }

if __name__ == "__main__":
    heatmap_data = generate_heatmap_data()
    print(json.dumps(heatmap_data, indent=2))
