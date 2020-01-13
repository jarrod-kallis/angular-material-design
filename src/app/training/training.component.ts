import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromTraining from './store/training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  private exerciseStatusChangedSubscription: Subscription;
  private _trainingTabCaption: string;

  constructor(
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    this.exerciseStatusChangedSubscription = this.store.select(fromTraining.getExerciseStarted)
      .subscribe((exerciseStarted: boolean) => {
        this._trainingTabCaption = exerciseStarted ? 'Training In Progress' : 'New Training';
      });
  }

  ngOnDestroy() {
    this.exerciseStatusChangedSubscription.unsubscribe();
  }

  get trainingTabCaption() {
    return this._trainingTabCaption;
  }
}
