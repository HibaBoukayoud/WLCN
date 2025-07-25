import { Component, OnInit, OnDestroy } from '@angular/core';
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
  dopplerData: DopplerData | null = null;
  currentFrame: number[][] = [];
  heatmapCells: Array<{row: number, col: number, value: number, color: string}> = [];
  maxValue: number = 0;
  minValue: number = 0;
  
  // Animation properties (come LivePlot_class.py)
  currentFrameIndex: number = 0;
  totalFrames: number = 0;
  isAnimating: boolean = false;
  animationInterval: any = null;
  animationSpeed: number = 100; // 100ms come nel LivePlot_class.py
  
  // Grid dimensions
  rows: number = 0;
  cols: number = 0;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchDopplerData();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  fetchDopplerData(): void {
    console.log('Fetching Range-Doppler Map data...');
    this.dataService.getDoppler().subscribe({
      next: (data: DopplerData) => {
        console.log('Range-Doppler Map data received:', data);
        this.dopplerData = data;
        this.initializeData();
      },
      error: (error) => {
        console.error('Error fetching Range-Doppler data:', error);
      }
    });
  }

  private initializeData(): void {
    if (!this.dopplerData || !this.dopplerData['Range-Doppler Map']) {
      console.error('Invalid Range-Doppler Map data');
      return;
    }

    const rangeData = this.dopplerData['Range-Doppler Map'];
    this.totalFrames = rangeData.length;
    
    if (this.totalFrames > 0) {
      this.rows = rangeData[0].length;
      this.cols = rangeData[0][0].length;
      
      // Calcola min/max su tutti i frame
      this.calculateGlobalMinMax();
      
      // Mostra il primo frame
      this.currentFrameIndex = 0;
      this.showFrame(this.currentFrameIndex);
    }
  }

  private calculateGlobalMinMax(): void {
    const allValues: number[] = [];
    this.dopplerData!['Range-Doppler Map'].forEach(frame => {
      frame.forEach(row => {
        allValues.push(...row);
      });
    });
    
    this.maxValue = Math.max(...allValues);
    this.minValue = Math.min(...allValues);
  }

  private showFrame(frameIndex: number): void {
    if (!this.dopplerData || frameIndex >= this.totalFrames) return;
    
    this.currentFrame = this.dopplerData['Range-Doppler Map'][frameIndex];
    this.generateHeatmapCells();
  }

  // Metodi di controllo animazione (come LivePlot_class.py)
  startAnimation(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentFrameIndex = 0;
    
    this.animationInterval = setInterval(() => {
      this.updateFrame();
    }, this.animationSpeed);
  }

  stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  private updateFrame(): void {
    if (this.currentFrameIndex < this.totalFrames) {
      this.showFrame(this.currentFrameIndex);
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
      this.showFrame(this.currentFrameIndex);
    }
  }

  previousFrame(): void {
    if (this.currentFrameIndex > 0) {
      this.currentFrameIndex--;
      this.showFrame(this.currentFrameIndex);
    }
  }

  goToFrame(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const frameIndex = +target.value;
      if (frameIndex >= 0 && frameIndex < this.totalFrames) {
        this.currentFrameIndex = frameIndex;
        this.showFrame(this.currentFrameIndex);
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

