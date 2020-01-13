import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';
import {
  StartFetchingAvailableExercises, StartFetchingAttemptedExercises, StartExercise,
  StartCancelExercise, PauseExercise, ResumeExercise
} from './store/training.actions';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  constructor(
    private store: Store<fromRoot.State>
  ) { }

  public fetchAvailableExercises(): void {
    this.store.dispatch(new StartFetchingAvailableExercises());
  }

  public fetchAttemptedExercises(): void {
    this.store.dispatch(new StartFetchingAttemptedExercises());
  }

  public startExercise(exerciseId: string) {
    this.store.dispatch(new StartExercise(exerciseId));
  }

  public cancelExercise() {
    this.store.dispatch(new StartCancelExercise());
  }

  public pauseExercise() {
    this.store.dispatch(new PauseExercise());
  }

  public resumeExercise() {
    this.store.dispatch(new ResumeExercise());
  }
}
