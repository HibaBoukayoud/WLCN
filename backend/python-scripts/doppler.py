import json
import numpy as np # Importa numpy per gestire array numerici e operazioni matematiche
import pyqtgraph as pg # Importa pyqtgraph per la visualizzazione grafica
from pyqtgraph import QtCore # Importa QtCore da pyqtgraph per gestire eventi e timer
from Classes.FileReader_class import fileReader; FR = fileReader() # Importa la classe fileReader per caricare i dati dai file
from Classes.LivePlot_class import LivePlot # Importa la classe LivePlot per gestire la visualizzazione in tempo reale



def extract_range_doppler():
    filepath = 'C:\\Users\\hibab\\Dropbox\\HBoukayoud\\Codes\\Dataset\\0-2000_1-2000_targets-frames_04Mar2025_16_50_35' # Percorso del file da caricare
    data = FR.load_data(filepath) # Chiama la funzione load_data() per caricare i dati dal file.
    RD_list = data[1] 

    # Converte l'array NumPy in una lista Python per la serializzazione JSON
    if isinstance(RD_list, np.ndarray):
        RD_list = RD_list.tolist()

    return {
        "Range-Doppler Map": RD_list
    }

def create_liveplot_from_data():
    """
    Crea un oggetto LivePlot e lo serializza in JSON
    """
    filepath = 'C:\\Users\\hibab\\Dropbox\\HBoukayoud\\Codes\\Dataset\\0-2000_1-2000_targets-frames_04Mar2025_16_50_35'
    data = FR.load_data(filepath)
    rd_data = data[1]  # Assumendo che i dati Range-Doppler siano in data[1]
    
    # Crea l'oggetto LivePlot
    live_plot = LivePlot(rd_data)
    
    # Serializza in JSON
    json_data = live_plot.to_json()
    
    return json_data

def save_liveplot_to_file():
    """
    Salva un oggetto LivePlot serializzato in un file JSON
    """
    filepath = 'C:\\Users\\hibab\\Dropbox\\HBoukayoud\\Codes\\Dataset\\0-2000_1-2000_targets-frames_04Mar2025_16_50_35'
    data = FR.load_data(filepath)
    rd_data = data[1]
    
    # Crea l'oggetto LivePlot
    live_plot = LivePlot(rd_data)
    
    # Salva in file JSON
    live_plot.save_to_file('liveplot_data.json')
    print("LivePlot salvato in 'liveplot_data.json'")

def load_liveplot_from_file():
    """
    Carica un oggetto LivePlot da un file JSON
    """
    live_plot = LivePlot.load_from_file('liveplot_data.json')
    return live_plot

if __name__ == "__main__": # Questa riga assicura che il codice venga eseguito solo se il file è eseguito direttamente, e non se viene importato in un altro script
    try:
        # Estrai Range-Doppler Map e stampa come JSON
        rd_data = extract_range_doppler()
        print(json.dumps(rd_data, indent=2))
    except Exception as e:
        # Se c'è un errore, stampa un JSON di fallback
        fallback_data = {
            "Range-Doppler Map": [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6], [0.7, 0.8, 0.9]]
        }
        print(json.dumps(fallback_data, indent=2))
