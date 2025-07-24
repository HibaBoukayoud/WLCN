import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

interface ChartData {
  hours: string[];
  targets: number[];
  total_detections: number;
  peak_hour: number;
  avg_per_hour: number;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  chartData: ChartData | null = null;
  chartPoints: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log('Statistics component initialized');
    this.loadChartData();
  }

  private loadChartData(): void {
    console.log('Loading chart data from API...');
    this.dataService.getChartData().subscribe({
      next: (data: ChartData) => {
        console.log('Chart data received successfully:', data);
        console.log('Data type:', typeof data);
        console.log('Data keys:', Object.keys(data));
        console.log('Targets property:', data.targets);
        console.log('Targets type:', typeof data.targets);
        this.chartData = data;
        this.generateChartPoints();
        console.log('Chart points generated:', this.chartPoints);
      },
      error: (error) => {
        console.error('Error fetching chart data:', error);
        console.error('Error details:', error.message, error.status);
        // Fallback to default data if API fails
        this.setDefaultData();
      }
    });
  }

  private generateChartPoints(): void {
    console.log('generateChartPoints called');
    console.log('chartData:', this.chartData);
    
    if (!this.chartData) {
      console.error('chartData is null or undefined');
      return;
    }
    
    if (!this.chartData.targets) {
      console.error('chartData.targets is undefined:', this.chartData);
      return;
    }
    
    if (!Array.isArray(this.chartData.targets)) {
      console.error('chartData.targets is not an array:', this.chartData.targets);
      return;
    }
    
    const points: string[] = [];
    const maxTargets = 8;
    const chartWidth = 240;
    const chartHeight = 100;
    
    this.chartData.targets.forEach((targets, index) => {
      const x = (index / (this.chartData!.targets.length - 1)) * chartWidth;
      const y = chartHeight - (targets / maxTargets) * chartHeight;
      points.push(`${x},${y}`);
    });
    
    this.chartPoints = points.join(' ');
    console.log('Chart points generated successfully:', this.chartPoints);
  }

  private setDefaultData(): void {
    this.chartData = {
      hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      targets: [1, 1, 2, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 5, 6, 7, 6, 5, 4, 3, 2, 2, 1, 1],
      total_detections: 89,
      peak_hour: 8,
      avg_per_hour: 3.7
    };
    this.generateChartPoints();
  }
}
