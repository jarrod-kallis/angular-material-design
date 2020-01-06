import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private _currentExercise: string = '';

  private _onTrainingStart = new EventEmitter<string>();
  private _onTrainingStop = new EventEmitter<void>();

  constructor() { }

  set currentExercise(value: string) {
    this._currentExercise = value;
  }

  get onTrainingStart(): EventEmitter<string> {
    return this._onTrainingStart;
  }

  get onTrainingStop(): EventEmitter<void> {
    return this._onTrainingStop;
  }

  public startTraining(exercise: string) {
    this.currentExercise = exercise;
    this._onTrainingStart.emit(exercise);
  }

  public stopTraining() {
    this.currentExercise = '';
    this._onTrainingStop.emit();
  }
}
