import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // TODO: fetch chart data
    this.dataService.getChartData().subscribe({
      next: (data) => {
        console.log('Chart data:', data);
        // TODO: update chart with data
      },
      error: (error) => {
        console.error('Error fetching chart data:', error);
      }
    });
  }
}
