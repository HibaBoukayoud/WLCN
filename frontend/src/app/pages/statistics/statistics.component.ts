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
    this.loadChartData();
  }

  private loadChartData(): void {
    this.dataService.getChartData().subscribe({
      next: (data: ChartData) => {
        console.log('Chart data:', data);
        this.chartData = data;
        this.generateChartPoints();
      },
      error: (error) => {
        console.error('Error fetching chart data:', error);
        // Fallback to default data if API fails
        this.setDefaultData();
      }
    });
  }

  private generateChartPoints(): void {
    if (!this.chartData) return;
    
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
