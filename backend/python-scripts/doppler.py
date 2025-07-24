import json
import random

def generate_doppler_data():
    # Genera 24 punti per le 24 ore
    hours = []
    distances = []
    
    for hour in range(24):
        hours.append(hour)
        # Distanza casuale da 0 a 5 metri
        distance = random.uniform(0, 5)
        distances.append(round(distance, 1))
    
    return {
        "hours": hours,
        "distances": distances
    }

if __name__ == "__main__":
    doppler_data = generate_doppler_data()
    print(json.dumps(doppler_data, indent=2))

