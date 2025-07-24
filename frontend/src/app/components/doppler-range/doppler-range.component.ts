import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

interface DopplerData {
  hours: number[];
  distances: number[];
}

@Component({
  selector: 'app-doppler-range',
  templateUrl: './doppler-range.component.html',
  styleUrls: ['./doppler-range.component.css']
})
export class DopplerRangeComponent implements OnInit {
  dopplerData: DopplerData | null = null;
  chartPoints: string = '';
  chartWidth = 300;
  chartHeight = 200;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchDopplerData();
  }

  fetchDopplerData(): void {
    console.log('Fetching Doppler data...');
    this.dataService.getDoppler().subscribe({
      next: (data: DopplerData) => {
        console.log('Doppler data received:', data);
        this.dopplerData = data;
        this.generateChartPoints();
      },
      error: (error) => {
        console.error('Error fetching Doppler data:', error);
      }
    });
  }

  private generateChartPoints(): void {
    if (!this.dopplerData || !this.dopplerData.hours || !this.dopplerData.distances) {
      console.error('Invalid doppler data for chart generation');
      return;
    }

    const points: string[] = [];
    
    this.dopplerData.hours.forEach((hour, index) => {
      const distance = this.dopplerData!.distances[index];
      
      // Convert hour to x position (0 to chartWidth)
      const x = (hour / 23) * this.chartWidth;
      
      // Convert distance to y position (0m at bottom, 5m at top)
      const y = (distance / 5) * this.chartHeight;
      
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    });
    
    this.chartPoints = points.join(' ');
    console.log('Chart points generated');
  }
}

