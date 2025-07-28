import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service';

interface DopplerData {
  "Range-Doppler Map": number[][][]; // Array di frame, ogni frame è una matrice 2D
}

@Component({
  selector: 'app-doppler-range',
  templateUrl: './doppler-range.component.html',
  styleUrls: ['./doppler-range.component.css']
})

export class DopplerRangeComponent implements OnInit, OnDestroy {
  currentFrame: number[][] = [];
  heatmapCells: Array<{row: number, col: number, value: number, color: string}> = [];
  maxValue: number = 0;
  minValue: number = 0;
  currentFrameIndex: number = 0;
  totalFrames: number = 0;
  // slideshow automatico, nessun controllo manuale
  animationInterval: any = null;
  animationSpeed: number = 1000; // 1s default per simulazione live
  rows: number = 0;
  cols: number = 0;
  liveMode: boolean = true; // Modalità live polling

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.currentFrameIndex = 0;
    this.fetchAndAnimate();
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  fetchDopplerFrame(frameIndex: number, callback?: () => void): void {
    this.dataService.getDoppler(frameIndex).subscribe({
      next: (data: any) => {
        if (data && data["Range-Doppler Map"]) {
          this.currentFrame = this.transposeMatrix(data["Range-Doppler Map"]);
          this.rows = this.currentFrame.length;
          this.cols = this.currentFrame[0]?.length || 0;
          this.maxValue = Math.max(...this.currentFrame.flat());
          this.minValue = Math.min(...this.currentFrame.flat());
          this.generateHeatmapCells();
          // Log per debug: mostra il primo valore del frame corrente
          if (this.currentFrame && this.currentFrame.length > 0 && this.currentFrame[0].length > 0) {
            console.log(`Frame ${frameIndex}: first value =`, this.currentFrame[0][0]);
          } else {
            console.log(`Frame ${frameIndex}: frame vuoto o non valido`);
          }
          this.cdr.detectChanges(); // forza aggiornamento Angular
          if (callback) callback();
        }
      },
      error: (error) => {
        console.error('Error fetching Range-Doppler frame:', error);
        if (callback) callback();
      }
    });
  }

  fetchAndAnimate(): void {
    this.fetchDopplerFrame(this.currentFrameIndex, () => {
      this.animationInterval = setInterval(() => {
        if (this.currentFrameIndex < 1999) {
          this.currentFrameIndex++;
          this.fetchDopplerFrame(this.currentFrameIndex);
        } else {
          clearInterval(this.animationInterval);
        }
      }, this.animationSpeed);
    });
  }

  // Nessun calcolo min/max globale, solo sul frame corrente

  // Legacy methods rimossi: ora si lavora solo su un frame alla volta

  // Funzione per trasporre una matrice (ruota di 90 gradi)
  private transposeMatrix(matrix: number[][]): number[][] {
    if (!matrix || matrix.length === 0) return matrix;
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposed: number[][] = [];
    
    // Crea la matrice trasposta: [i][j] diventa [j][i]
    for (let j = 0; j < cols; j++) {
      transposed[j] = [];
      for (let i = 0; i < rows; i++) {
        transposed[j][i] = matrix[i][j];
      }
    }
    
    return transposed;
  }

  // Metodi di controllo animazione (come LivePlot_class.py)
  startAnimation(): void {
    this.currentFrameIndex = 0;
    this.fetchDopplerFrame(this.currentFrameIndex);
    this.animationInterval = setInterval(() => {
      if (this.currentFrameIndex < this.totalFrames - 1) {
        this.currentFrameIndex++;
        this.fetchDopplerFrame(this.currentFrameIndex);
      } else {
        this.stopAnimation();
      }
    }, this.animationSpeed);
  }

  stopAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  private updateFrame(): void {
    if (this.currentFrameIndex < this.totalFrames) {
      // La visualizzazione del frame viene gestita da fetchDopplerFrame/fetchTotalFrames
      console.log(`Frame: ${this.currentFrameIndex}`);
      this.currentFrameIndex++;
    } else {
      this.stopAnimation(); // Si ferma quando raggiunge l'ultimo frame
    }
  }

  // Controlli manuali
  nextFrame(): void {
    if (this.currentFrameIndex < this.totalFrames - 1) {
      this.currentFrameIndex++;
      this.fetchDopplerFrame(this.currentFrameIndex);
    }
  }

  previousFrame(): void {
    if (this.currentFrameIndex > 0) {
      this.currentFrameIndex--;
      this.fetchDopplerFrame(this.currentFrameIndex);
    }
  }

  goToFrame(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const frameIndex = +target.value;
      if (frameIndex >= 0 && frameIndex < this.totalFrames) {
        this.currentFrameIndex = frameIndex;
        this.fetchDopplerFrame(this.currentFrameIndex);
      }
    }
  }

  private generateHeatmapCells(): void {
    if (!this.currentFrame || this.currentFrame.length === 0) {
      console.error('Invalid current frame data');
      return;
    }

    this.heatmapCells = [];
    
    this.currentFrame.forEach((row: number[], rowIndex: number) => {
      row.forEach((value: number, colIndex: number) => {
        // Normalizza il valore tra 0 e 1 usando i valori globali min/max
        const normalizedValue = this.maxValue !== this.minValue 
          ? (value - this.minValue) / (this.maxValue - this.minValue)
          : 0;
        
        // Genera colore basato sul valore (viridis-like colormap come pyqtgraph)
        const color = this.getViridisColor(normalizedValue);
        
        this.heatmapCells.push({
          row: rowIndex,
          col: colIndex,
          value: value,
          color: color
        });
      });
    });
    
    console.log(`Frame ${this.currentFrameIndex}: ${this.heatmapCells.length} cells generated`);
  }

  private getViridisColor(normalizedValue: number): string {
    // Replica il colormap viridis di pyqtgraph
    // Transizione: Viola scuro -> Blu -> Verde -> Giallo
    if (normalizedValue <= 0.25) {
      // Viola scuro a Blu
      const t = normalizedValue / 0.25;
      const r = Math.round(68 + (59 - 68) * t);
      const g = Math.round(1 + (82 - 1) * t);
      const b = Math.round(84 + (139 - 84) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalizedValue <= 0.5) {
      // Blu a Verde scuro
      const t = (normalizedValue - 0.25) / 0.25;
      const r = Math.round(59 + (33 - 59) * t);
      const g = Math.round(82 + (144 - 82) * t);
      const b = Math.round(139 + (140 - 139) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalizedValue <= 0.75) {
      // Verde scuro a Verde chiaro
      const t = (normalizedValue - 0.5) / 0.25;
      const r = Math.round(33 + (94 - 33) * t);
      const g = Math.round(144 + (201 - 144) * t);
      const b = Math.round(140 + (98 - 140) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Verde chiaro a Giallo
      const t = (normalizedValue - 0.75) / 0.25;
      const r = Math.round(94 + (253 - 94) * t);
      const g = Math.round(201 + (231 - 201) * t);
      const b = Math.round(98 + (37 - 98) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
}

