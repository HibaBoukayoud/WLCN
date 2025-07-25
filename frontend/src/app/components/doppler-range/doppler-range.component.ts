import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

interface DopplerData {
  data: number[][];
  title: string;
  color_map: string;
}

@Component({
  selector: 'app-doppler-range',
  templateUrl: './doppler-range.component.html',
  styleUrls: ['./doppler-range.component.css']
})
export class DopplerRangeComponent implements OnInit {
  dopplerData: DopplerData | null = null;
  heatmapCells: Array<{row: number, col: number, value: number, color: string}> = [];
  maxValue: number = 0;
  minValue: number = 0;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchDopplerData();
  }

  fetchDopplerData(): void {
    console.log('Fetching Doppler heatmap data...');
    console.log('Making request to data service...');
    this.dataService.getDoppler().subscribe({
      next: (data: DopplerData) => {
        console.log('Doppler heatmap data received:', data);
        console.log('Data keys:', Object.keys(data));
        console.log('Data.data:', data.data);
        this.dopplerData = data;
        this.generateHeatmapCells();
      },
      error: (error) => {
        console.error('Error fetching Doppler data:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Full error object:', error);
      }
    });
  }

  private generateHeatmapCells(): void {
    if (!this.dopplerData || !this.dopplerData.data) {
      console.error('Invalid heatmap data');
      return;
    }

    const flatData = this.dopplerData.data.flat();
    this.maxValue = Math.max(...flatData);
    this.minValue = Math.min(...flatData);

    this.heatmapCells = [];
    
    this.dopplerData.data.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        // Normalizza il valore tra 0 e 1
        const normalizedValue = (value - this.minValue) / (this.maxValue - this.minValue);
        
        // Genera colore basato sul valore (heatmap style)
        const color = this.getHeatmapColor(normalizedValue);
        
        this.heatmapCells.push({
          row: rowIndex,
          col: colIndex,
          value: value,
          color: color
        });
      });
    });
    
    console.log('Heatmap cells generated:', this.heatmapCells.length);
  }

  private getHeatmapColor(normalizedValue: number): string {
    // Genera colori dal blu (0) al rosso (1) per simulare una heatmap
    if (normalizedValue < 0.33) {
      // Blu a Ciano
      const intensity = Math.round(normalizedValue * 3 * 255);
      return `rgb(0, ${intensity}, 255)`;
    } else if (normalizedValue < 0.66) {
      // Ciano a Giallo
      const intensity = Math.round((normalizedValue - 0.33) * 3 * 255);
      return `rgb(${intensity}, 255, ${255 - intensity})`;
    } else {
      // Giallo a Rosso
      const intensity = Math.round((normalizedValue - 0.66) * 3 * 255);
      return `rgb(255, ${255 - intensity}, 0)`;
    }
  }
}

