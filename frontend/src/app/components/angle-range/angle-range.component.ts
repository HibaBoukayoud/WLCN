import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-angle-range',
  templateUrl: './angle-range.component.html',
  styleUrls: ['./angle-range.component.css']
})
export class AngleRangeComponent implements OnInit {
  angleData: any = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchAngleData();
  }

  fetchAngleData(): void {
    this.dataService.getAngle().subscribe({
      next: (data) => {
        this.angleData = data;
        // TODO: implement animation and visualization of angle data
      },
      error: (error) => {
        console.error('Error fetching angle data:', error);
      }
    });
  }
}
