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
  private dataSubscription?: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataSubscription = interval(3000).pipe(
      switchMap(() => this.dataService.getTargets())
    ).subscribe({
      next: (data) => {
        this.targetData = data;
        // TODO: implement animation when target count changes
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
