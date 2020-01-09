import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';

import { Exercise, ExerciseStatus } from './exercise.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private _availableExercises: Exercise[] = [];

  private _attemptedExercises: Exercise[] = [];

  private _currentExercise: Exercise;
  private _exerciseStarted: boolean = false;
  private _exerciseProgressTimerId: NodeJS.Timer;
  private _exerciseProgressPercentage: number = 0;

  private _onExerciseStatusChanged = new BehaviorSubject<void>(null);
  private _onExerciseProgressPercentageChanged = new Subject<number>();
  private _onAvailableExecisesChanged = new Subject<void>();

  constructor(private db: AngularFirestore) { }

  public fetchAvailableExercises(): void {
    // { idField: 'id' }: Adds the id field to the valueChanges observable, otherwise it only returns the user-created data
    // https://stackoverflow.com/questions/46900430/firestore-getting-documents-id-from-collection
    (this.db.collection<Exercise>('availableExercises')
      .valueChanges({ idField: 'id' }) as Observable<Exercise[]>)
      .subscribe((exercises: Exercise[]) => {
        this._availableExercises = [...exercises];
        this._onAvailableExecisesChanged.next();
      });

    // Another way of getting the exercise data, but the way above is better if using Angular 8+ & Firebase 6+
    // return this.db.collection<Exercise>('availableExercises')
    //   .snapshotChanges()
    //   .pipe(
    //     map(dataArray => {
    //       console.log(dataArray);
    //       return dataArray.map(data => ({
    //         id: data.payload.doc.id,
    //         ...data.payload.doc.data()
    //       }))
    //     })
    //   )
    //   .subscribe(exercises => console.log(exercises));
  }

  get availableExercises(): Exercise[] {
    return [...this._availableExercises];
  }

  get attemptedExercises(): Exercise[] {
    return [...this._attemptedExercises];
  }

  get currentExercise(): Exercise {
    return this._currentExercise;
  }

  get exerciseStarted(): boolean {
    return this._exerciseStarted;
  }

  get exerciseProgressTimerId(): NodeJS.Timer {
    return this._exerciseProgressTimerId;
  }

  get exerciseProgressPercentage(): number {
    return this._exerciseProgressPercentage;
  }

  get onExerciseStatusChanged(): BehaviorSubject<void> {
    return this._onExerciseStatusChanged;
  }

  get onExerciseProgressPercentageChanged(): Subject<number> {
    return this._onExerciseProgressPercentageChanged;
  }

  get onAvailableExercisesChanged(): Subject<void> {
    return this._onAvailableExecisesChanged;
  }

  private getExerciseById(exerciseId: string): Exercise {
    return this._availableExercises.find((exercise: Exercise) => exercise.id === exerciseId);
  }

  public startExercise(exerciseId: string) {
    this._currentExercise = { ...this.getExerciseById(exerciseId) };
    this._currentExercise.status = ExerciseStatus.Busy;
    this._currentExercise.startDate = new Date();

    this._attemptedExercises.push(this._currentExercise);

    this._exerciseProgressPercentage = 0;
    this._exerciseStarted = true;
    this.startExerciseTimer();

    this._onExerciseStatusChanged.next();
  }

  private completeOrCancelExercise(status: ExerciseStatus, endDate: Date): void {
    let newExercise: Exercise = new Exercise(
      this._currentExercise.id,
      this._currentExercise.name,
      this._currentExercise.duration,
      this._currentExercise.calories,
      status,
      this._currentExercise.startDate,
      endDate
    );

    this.db.collection('attemptedExercises')
      .add(newExercise.objectToSave())
      .then((result: DocumentReference) => {
        this._attemptedExercises = this._attemptedExercises.map(
          (exercise: Exercise, idx: number) => {
            if (idx === this._attemptedExercises.length - 1) {
              newExercise.id = result.id;
              return newExercise;
              // The above is better, because it results in an actual Exercise object being added,
              // instead of an object that has the same properties as an Exercise
              // return { ...completedExercise, id: result.id };
            } else {
              return exercise;
            }
          }
        );
        console.log(this._attemptedExercises);
        this._onExerciseStatusChanged.next();
      });

    this._exerciseProgressPercentage = 0;
    this._exerciseStarted = false;
    this._currentExercise = null;
    this.stopExerciseTimer();
  }

  public completeExercise() {
    this.completeOrCancelExercise(ExerciseStatus.Completed, new Date());
  }

  public cancelExercise() {
    this.completeOrCancelExercise(ExerciseStatus.Cancelled, new Date());
  }

  public pauseExercise() {
    this.stopExerciseTimer();
  }

  public resumeExercise() {
    this.startExerciseTimer();
  }

  private startExerciseTimer() {
    this._exerciseProgressTimerId = setInterval(() => {
      this._exerciseProgressPercentage = Math.ceil(this._exerciseProgressPercentage + (1 / this._currentExercise.duration * 100));

      this._attemptedExercises = this._attemptedExercises.map(
        (exercise: Exercise, idx: number) => {
          if (idx === this._attemptedExercises.length - 1) {
            return new Exercise(
              this._currentExercise.id,
              this._currentExercise.name,
              this._currentExercise.duration * (this._exerciseProgressPercentage / 100),
              this._currentExercise.calories * (this._exerciseProgressPercentage / 100),
              this._currentExercise.status,
              this._currentExercise.startDate,
              this._currentExercise.endDate
            );
          } else {
            return exercise;
          }
        }
      );

      if (this._exerciseProgressPercentage >= 100) {
        this._exerciseProgressPercentage = 100;
        this.completeExercise();
      }

      this._onExerciseStatusChanged.next();
      this._onExerciseProgressPercentageChanged.next(this._exerciseProgressPercentage);
    }, 1000);
  }

  private stopExerciseTimer() {
    clearInterval(this._exerciseProgressTimerId);
  }
}
