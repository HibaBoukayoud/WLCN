import numpy as np # Libreria per gestire array numerici e operazioni matematiche: aiuta nella gestione delle matrici della Range-Doppler Map.
import pyqtgraph as pg # Libreria per la visualizzazione grafica interattiva
# import pyqtgraph.exporters # Modulo di pyqtgraph per esportare immagini
# from colormap import get_jet_colormap

from pyqtgraph import QtCore

from Classes.FileReader_class import fileReader ; FR = fileReader()
from Classes.LivePlot_class import LivePlot ; #LP = LivePlot() no need, already in main


if __name__ == "__main__": # Questa riga assicura che il codice venga eseguito solo se il file è eseguito direttamente, e non se viene importato in un altro script
    
    filepath = '../Dataset/0-2000_1-2000_targets-frames_04Mar2025_16_50_35' # Percorso del file da caricare

    data = FR.load_data(filepath) # Chiama la funzione load_data() per caricare i dati dal file.

    RD_list = data[1] # 1 è il numero di target
    #print(f"Total frames: {len(RD_list)}") # Check the number of frames

    plot = LivePlot(RD_list)  # Initialize the plot
    plot.start()              # Now start the event loop
    