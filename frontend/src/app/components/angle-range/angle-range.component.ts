
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-angle-range',
  templateUrl: './angle-range.component.html',
  styleUrls: ['./angle-range.component.css']
})
export class AngleRangeComponent implements OnInit, OnDestroy {
  currentAngleFrame: number[][] = [];
  angleHeatmapCells: Array<{row: number, col: number, value: number, color: string}> = [];
  maxValue: number = 0;
  minValue: number = 0;
  currentAngleFrameIndex: number = 0;
  totalAngleFrames: number = 0;
  animationInterval: any = null;
  animationSpeed: number = 1000;
  rows: number = 0;
  cols: number = 0;

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.currentAngleFrameIndex = 0;
    this.fetchAndAnimateAngle();
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  fetchAngleFrame(frameIndex: number, callback?: () => void): void {
    this.dataService.getAngle(frameIndex).subscribe({
      next: (data: any) => {
        if (data && data["Angle-Range Map"]) {
          this.currentAngleFrame = this.transposeMatrix(data["Angle-Range Map"]);
          this.rows = this.currentAngleFrame.length;
          this.cols = this.currentAngleFrame[0]?.length || 0;
          this.maxValue = Math.max(...this.currentAngleFrame.flat());
          this.minValue = Math.min(...this.currentAngleFrame.flat());
          this.generateAngleHeatmapCells();
          this.cdr.detectChanges();
          if (callback) callback();
        }
      },
      error: (error) => {
        console.error('Error fetching Angle-Range frame:', error);
        if (callback) callback();
      }
    });
  }

  fetchAndAnimateAngle(): void {
    this.fetchAngleFrame(this.currentAngleFrameIndex, () => {
      this.animationInterval = setInterval(() => {
        if (this.currentAngleFrameIndex < 1999) {
          this.currentAngleFrameIndex++;
          this.fetchAngleFrame(this.currentAngleFrameIndex);
        } else {
          clearInterval(this.animationInterval);
        }
      }, this.animationSpeed);
    });
  }

  private transposeMatrix(matrix: number[][]): number[][] {
    if (!matrix || matrix.length === 0) return matrix;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposed: number[][] = [];
    for (let j = 0; j < cols; j++) {
      transposed[j] = [];
      for (let i = 0; i < rows; i++) {
        transposed[j][i] = matrix[i][j];
      }
    }
    return transposed;
  }

  private generateAngleHeatmapCells(): void {
    if (!this.currentAngleFrame || this.currentAngleFrame.length === 0) {
      console.error('Invalid current angle frame data');
      return;
    }
    this.angleHeatmapCells = [];
    this.currentAngleFrame.forEach((row: number[], rowIndex: number) => {
      row.forEach((value: number, colIndex: number) => {
        const normalizedValue = this.maxValue !== this.minValue 
          ? (value - this.minValue) / (this.maxValue - this.minValue)
          : 0;
        const color = this.getViridisColor(normalizedValue);
        this.angleHeatmapCells.push({
          row: rowIndex,
          col: colIndex,
          value: value,
          color: color
        });
      });
    });
  }

  private getViridisColor(normalizedValue: number): string {
    if (normalizedValue <= 0.25) {
      const t = normalizedValue / 0.25;
      const r = Math.round(68 + (59 - 68) * t);
      const g = Math.round(1 + (82 - 1) * t);
      const b = Math.round(84 + (139 - 84) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalizedValue <= 0.5) {
      const t = (normalizedValue - 0.25) / 0.25;
      const r = Math.round(59 + (33 - 59) * t);
      const g = Math.round(82 + (144 - 82) * t);
      const b = Math.round(139 + (140 - 139) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalizedValue <= 0.75) {
      const t = (normalizedValue - 0.5) / 0.25;
      const r = Math.round(33 + (94 - 33) * t);
      const g = Math.round(144 + (201 - 144) * t);
      const b = Math.round(140 + (98 - 140) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (normalizedValue - 0.75) / 0.25;
      const r = Math.round(94 + (253 - 94) * t);
      const g = Math.round(201 + (231 - 201) * t);
      const b = Math.round(98 + (37 - 98) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
}
