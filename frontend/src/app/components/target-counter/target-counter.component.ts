import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-target-counter',
  templateUrl: './target-counter.component.html',
  styleUrls: ['./target-counter.component.css']
})
export class TargetCounterComponent implements OnInit, OnDestroy {
  targetData: any = null;
  frameIndex: number = 0;
  private dataSubscription?: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataSubscription = interval(3000).pipe(
      switchMap(() => this.dataService.getTargets(this.frameIndex))
    ).subscribe({
      next: (data) => {
        console.log('[FRONTEND] Ricevuto predicted targets:', data);
        this.targetData = data;
        if (data && typeof data === 'object') {
          console.log('[FRONTEND] Predicted targets value:', data.predicted_targets);
          console.log('[FRONTEND] Frame index:', data.frame_index);
        } else {
          console.warn('[FRONTEND] Dato prediction non valido:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching target data:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
