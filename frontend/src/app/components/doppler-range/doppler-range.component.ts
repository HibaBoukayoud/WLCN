import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-doppler-range',
  templateUrl: './doppler-range.component.html',
  styleUrls: ['./doppler-range.component.css']
})
export class DopplerRangeComponent implements OnInit, OnDestroy {
  plotData: any[] = [];
  plotLayout: any = {};
  currentFrameIndex: number = 0;
  totalFrames: number = 0;
  animationInterval: any = null;
  animationSpeed: number = 1000;

  heatmapCells: Array<{row: number, col: number, value: number, color: string}> = [];
  rows: number = 0;
  cols: number = 0;

  constructor(private dataService: DataService) { }

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
    console.log('[FRONTEND] Richiesta frame Doppler:', frameIndex);
    this.dataService.getDoppler(frameIndex).subscribe({
      next: (data: any) => {
        console.log('[FRONTEND] Ricevuto frame Doppler:', frameIndex, 'Data:', data);
        if (data && data["Range-Doppler Map"]) {
          this.totalFrames = data["available_frames"] || 1;
          const map = data["Range-Doppler Map"];
          this.rows = map.length;
          this.cols = map[0]?.length || 0;
          // Flatten and colorize
          const flat: Array<{row: number, col: number, value: number, color: string}> = [];
          let min = Infinity, max = -Infinity;
          for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
              const v = map[r][c];
              if (v < min) min = v;
              if (v > max) max = v;
            }
          }
          // Simple Viridis color scale (linear interpolation)
          function viridisColor(val: number, min: number, max: number): string {
            const t = (val - min) / (max - min || 1);
            // Approximate viridis gradient
            const stops = [
              [68, 1, 84], [71, 44, 122], [59, 81, 139], [44, 113, 142],
              [33, 144, 141], [39, 173, 129], [92, 200, 99], [170, 220, 50], [253, 231, 37]
            ];
            const idx = Math.floor(t * (stops.length - 1));
            const [r, g, b] = stops[idx];
            return `rgb(${r},${g},${b})`;
          }
          for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
              flat.push({
                row: r,
                col: c,
                value: map[r][c],
                color: viridisColor(map[r][c], min, max)
              });
            }
          }
          this.heatmapCells = flat;
          console.log('[FRONTEND] Aggiornata heatmapCells, frame:', frameIndex, 'cells:', flat.length);
          if (callback) callback();
        } else {
          this.heatmapCells = [];
          console.warn('[FRONTEND] Nessun dato Range-Doppler Map per frame:', frameIndex);
        }
      },
      error: (error) => {
        console.error('[FRONTEND] Errore fetch Range-Doppler frame:', frameIndex, error);
        this.heatmapCells = [];
        if (callback) callback();
      }
    });
  }

  fetchAndAnimate(): void {
    this.fetchDopplerFrame(this.currentFrameIndex, () => {
      this.animationInterval = setInterval(() => {
        if (this.currentFrameIndex < this.totalFrames - 1) {
          this.currentFrameIndex++;
          this.fetchDopplerFrame(this.currentFrameIndex);
        } else {
          clearInterval(this.animationInterval);
        }
      }, this.animationSpeed);
    });
  }

  // Puoi aggiungere qui i metodi per animazione e cambio frame come prima, ma ora basta chiamare fetchDopplerFrame con l'indice desiderato.
}
