import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-target-chart',
  templateUrl: './target-chart.component.html',
  styleUrls: ['./target-chart.component.css']
})
export class TargetChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Initialize component
  }

  ngAfterViewInit(): void {
    this.fetchChartData();
  }

  fetchChartData(): void {
    this.dataService.getChartData().subscribe({
      next: (data) => {
        this.initializeChart(data);
      },
      error: (error) => {
        console.error('Error fetching chart data:', error);
      }
    });
  }

  initializeChart(data: any): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.datasets[0].label,
          data: data.datasets[0].data,
          backgroundColor: 'rgba(0, 212, 255, 0.2)',
          borderColor: 'rgba(10, 37, 64, 1)',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: 'rgba(0, 212, 255, 1)',
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Target Detection Trends'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
