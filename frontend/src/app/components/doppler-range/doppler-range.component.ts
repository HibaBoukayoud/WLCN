import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
// @ts-ignore
import * as Plotly from 'plotly.js-dist-min';
// Import PlotlyModule in app.module.ts

@Component({
  selector: 'app-doppler-range',
  templateUrl: './doppler-range.component.html',
  styleUrls: ['./doppler-range.component.css']
})
export class DopplerRangeComponent implements OnInit, OnDestroy {
  plotData: any[] = [];
  plotLayout: any = {};
  currentFrameIndex: number = 0;
  totalFrames: number = 0;
  animationInterval: any = null;
  animationSpeed: number = 1000;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.currentFrameIndex = 0;
    this.fetchAndAnimate();
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  fetchDopplerFrame(frameIndex: number, callback?: () => void): void {
    this.dataService.getDoppler(frameIndex).subscribe({
      next: (data: any) => {
        if (data && data["Range-Doppler Map"]) {
          this.totalFrames = data["available_frames"] || 1;
          this.plotData = [{
            z: data["Range-Doppler Map"],
            type: 'heatmap',
            colorscale: 'Viridis'
          }];
          this.plotLayout = {
            title: `Range-Doppler Map – Frame ${frameIndex}`,
            xaxis: { title: 'Speed bins' },
            yaxis: { title: 'Distance bins' }
          };
          if (callback) callback();
        }
      },
      error: (error) => {
        console.error('Error fetching Range-Doppler frame:', error);
        if (callback) callback();
      }
    });
  }

  fetchAndAnimate(): void {
    this.fetchDopplerFrame(this.currentFrameIndex, () => {
      this.animationInterval = setInterval(() => {
        if (this.currentFrameIndex < this.totalFrames - 1) {
          this.currentFrameIndex++;
          this.fetchDopplerFrame(this.currentFrameIndex);
        } else {
          clearInterval(this.animationInterval);
        }
      }, this.animationSpeed);
    });
  }

  // Puoi aggiungere qui i metodi per animazione e cambio frame come prima, ma ora basta chiamare fetchDopplerFrame con l'indice desiderato.
}
