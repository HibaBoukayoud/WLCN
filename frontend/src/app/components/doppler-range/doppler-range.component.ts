import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

interface DopplerData {
  "Range-Doppler Map": number[][];
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
    console.log('Fetching Range-Doppler Map data...');
    console.log('Making request to data service...');
    this.dataService.getDoppler().subscribe({
      next: (data: DopplerData) => {
        console.log('Range-Doppler Map data received:', data);
        console.log('Data keys:', Object.keys(data));
        console.log('Range-Doppler Map:', data['Range-Doppler Map']);
        this.dopplerData = data;
        this.generateHeatmapCells();
      },
      error: (error) => {
        console.error('Error fetching Range-Doppler data:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Full error object:', error);
      }
    });
  }

  private generateHeatmapCells(): void {
    if (!this.dopplerData || !this.dopplerData['Range-Doppler Map']) {
      console.error('Invalid Range-Doppler Map data');
      return;
    }

    const rangeData = this.dopplerData['Range-Doppler Map'];
    const flatData = rangeData.flat();
    this.maxValue = Math.max(...flatData);
    this.minValue = Math.min(...flatData);

    this.heatmapCells = [];
    
    rangeData.forEach((row: number[], rowIndex: number) => {
      row.forEach((value: number, colIndex: number) => {
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
    
    console.log('Range-Doppler heatmap cells generated:', this.heatmapCells.length);
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

