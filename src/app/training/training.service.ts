import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Exercise, ExerciseStatus } from './exercise.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private _availableExercises: Exercise[] = [
    new Exercise('pull-ups', 'Pull Ups', 10, 20),
    new Exercise('monkey-bars', 'Monkey Bars', 30, 50),
    new Exercise('burpees', 'Burpees', 60, 150),
    new Exercise('cross-trainer', 'Cross Trainer', 120, 250),
  ];

  private _attemptedExercises: Exercise[] = [];

  private _currentExercise: Exercise;

  private _onTrainingStart = new Subject<Exercise>();
  private _onTrainingStop = new Subject<void>();

  constructor() { }

  get availableExercises(): Exercise[] {
    return [...this._availableExercises];
  }

  get attemptedExercises(): Exercise[] {
    return [...this._attemptedExercises];
  }

  set currentExercise(value: Exercise) {
    this._currentExercise = value;
  }

  get onTrainingStart(): Subject<Exercise> {
    return this._onTrainingStart;
  }

  get onTrainingStop(): Subject<void> {
    return this._onTrainingStop;
  }

  private getExerciseById(exerciseId: string): Exercise {
    return this._availableExercises.find((exercise: Exercise) => exercise.id === exerciseId);
  }

  public startTraining(exerciseId: string) {
    this.currentExercise = { ...this.getExerciseById(exerciseId) };
    this._currentExercise.status = ExerciseStatus.Busy;
    this._currentExercise.startDate = new Date();

    this._attemptedExercises.push(this._currentExercise);

    this._onTrainingStart.next(this._currentExercise);
  }

  public completeTraining() {
    this._attemptedExercises = this._attemptedExercises.map(
      (exercise: Exercise, idx: number) => {
        if (idx === this._attemptedExercises.length - 1) {
          return new Exercise(
            this._currentExercise.id,
            this._currentExercise.name,
            this._currentExercise.duration,
            this._currentExercise.calories,
            ExerciseStatus.Completed,
            this._currentExercise.startDate,
            new Date()
          );
        } else {
          return exercise;
        }
      }
    );

    this.currentExercise = null;
    this._onTrainingStop.next();

    console.log(this._attemptedExercises);
  }

  public cancelTraining(progressPercentage: number) {
    this._attemptedExercises = this._attemptedExercises.map(
      (exercise: Exercise, idx: number) => {
        if (idx === this._attemptedExercises.length - 1) {
          return new Exercise(
            this._currentExercise.id,
            this._currentExercise.name,
            this._currentExercise.duration * (progressPercentage / 100),
            this._currentExercise.calories * (progressPercentage / 100),
            ExerciseStatus.Cancelled,
            this._currentExercise.startDate,
            new Date()
          );
        } else {
          return exercise;
        }
      }
    );

    this.currentExercise = null;
    this._onTrainingStop.next();

    console.log(this._attemptedExercises);
  }
}
