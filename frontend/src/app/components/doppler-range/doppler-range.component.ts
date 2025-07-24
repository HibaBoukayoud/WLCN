import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-doppler-range',
  templateUrl: './doppler-range.component.html',
  styleUrls: ['./doppler-range.component.css']
})
export class DopplerRangeComponent implements OnInit {
  dopplerData: any = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchDopplerData();
  }

  fetchDopplerData(): void {
    this.dataService.getDoppler().subscribe({
      next: (data) => {
        this.dopplerData = data;
        // TODO: implement animation and visualization of Doppler data
      },
      error: (error) => {
        console.error('Error fetching Doppler data:', error);
      }
    });
  }
}

