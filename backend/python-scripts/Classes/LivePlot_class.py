import json
import numpy as np # Importa numpy per gestire array numerici e operazioni matematiche
import pyqtgraph as pg # Importa pyqtgraph per la visualizzazione grafica
from pyqtgraph import QtCore # Importa QtCore da pyqtgraph per gestire eventi e timer
from Classes.FileReader_class import fileReader; FR = fileReader()


class LivePlot(): 
    def __init__(self, rd_data, colormap='viridis', window_title='Range-Doppler Map', width=800, height=800): 
        self.rd_data = rd_data # Stores the list of Range-Doppler matrices to display
        self.index = 0 # Current frame index for animation

        self.app = pg.mkQApp(window_title)
        self.win = pg.GraphicsLayoutWidget(show=True)
        self.win.setWindowTitle(window_title)
        self.win.resize(width, height)

        self.plot = self.win.addPlot()
        self.img = pg.ImageItem(self.rd_data[self.index]) # Initializes the image with the first RD frame
        self.plot.addItem(self.img) # Adds the image to the plot


        color_map = pg.colormap.get(colormap)
        self.bar = pg.ColorBarItem(colorMap=color_map, interactive=False) # Creates a non-interactive color bar
        self.bar.setImageItem(self.img, insert_in=self.plot)

        self.timer = QtCore.QTimer() # Creates a timer to update the image periodically
        self.timer.timeout.connect(self.update) # Connects the timer to the update function
        self.timer.start(100) # Starts the timer with a 10ms interval between updates

    def update(self): # Must check if the index is within the bounds of the list
        if self.index < len(self.rd_data):
            self.img.setImage(self.rd_data[self.index])
            print(f"Frame: {self.index}")
            self.index += 1
        else:
            self.timer.stop() # Stops the timer when the last frame is reached

    def start(self):
        pg.exec()  # Starts the GUI event loop


    def to_json(self):
            """
            Serializza l'oggetto LivePlot in formato JSON
            """
            # Converte gli array NumPy in liste Python
            rd_data_list = []
            for frame in self.rd_data:
                if isinstance(frame, np.ndarray):
                    rd_data_list.append(frame.tolist())
                else:
                    rd_data_list.append(frame)
            
            return {
                "rd_data": rd_data_list,
                "index": self.index,
                "window_title": self.win.windowTitle(),
                "width": self.win.width(),
                "height": self.win.height()
            }
    
    @classmethod
    def from_json(cls, json_data, colormap='viridis'):
        """
        Crea un oggetto LivePlot da dati JSON
        """
        # Converte le liste Python in array NumPy
        rd_data = []
        for frame in json_data["rd_data"]:
            rd_data.append(np.array(frame))
        
        # Crea l'oggetto con i parametri dal JSON
        obj = cls(
            rd_data=rd_data,
            colormap=colormap,
            window_title=json_data.get("window_title", "Range-Doppler Map"),
            width=json_data.get("width", 800),
            height=json_data.get("height", 800)
        )
        obj.index = json_data.get("index", 0)
        return obj
    
    def save_to_file(self, filepath):
        """
        Salva l'oggetto LivePlot in un file JSON
        """
        with open(filepath, 'w') as f:
            json.dump(self.to_json(), f, indent=4)
    
    @classmethod
    def load_from_file(cls, filepath, colormap='viridis'):
        """
        Carica un oggetto LivePlot da un file JSON
        """
        with open(filepath, 'r') as f:
            json_data = json.load(f)
        return cls.from_json(json_data, colormap)
