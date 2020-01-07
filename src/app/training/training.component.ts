import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from './training.service';
import { Exercise } from './exercise.model';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  private trainingStartSubscription: Subscription;
  private trainingStopSubscription: Subscription;

  exercise: Exercise = null;
  trainingStarted: boolean = false;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.trainingStartSubscription = this.trainingService.onTrainingStart.subscribe((exercise: Exercise) => {
      this.exercise = exercise;
      this.trainingStarted = true;
    });

    this.trainingStopSubscription = this.trainingService.onTrainingStop.subscribe(() => {
      this.exercise = null;
      this.trainingStarted = false;
    });
  }

  ngOnDestroy() {
    this.trainingStartSubscription.unsubscribe();
    this.trainingStopSubscription.unsubscribe();
  }
}
