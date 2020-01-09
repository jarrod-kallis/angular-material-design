import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { Exercise, ExerciseStatus } from './exercise.model';
import { GuiService } from '../shared/services/gui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  // All possible exercises to choose from
  private _availableExercises: Exercise[] = [];

  // All exercises that the user has started
  private _attemptedExercises: Exercise[] = [];

  private _currentExercise: Exercise;
  private _exerciseStarted: boolean = false;
  private _exerciseProgressTimerId: NodeJS.Timer;
  private _exerciseProgressPercentage: number = 0;

  private _onExerciseStatusChanged = new BehaviorSubject<void>(null);
  private _onExerciseProgressPercentageChanged = new Subject<number>();
  private _onAvailableExercisesChanged = new Subject<void>();
  private _onAttemptedExercisesChanged = new BehaviorSubject<void>(null);

  private fetchAvailableExercisesSubscription: Subscription;
  private fetchAttemptedExercisesSubscription: Subscription;

  constructor(private db: AngularFirestore, private guiService: GuiService) { }

  public fetchAvailableExercises(): void {
    this.guiService.isLoading = true;

    if (this.fetchAvailableExercisesSubscription) {
      // console.log('TrainingService.fetchAvailableExercises() unsubscribe');
      this.fetchAvailableExercisesSubscription.unsubscribe();
      this.fetchAvailableExercisesSubscription = null;
    }

    // { idField: 'id' }: Adds the id field to the valueChanges observable, otherwise it only returns the user-created data
    // https://stackoverflow.com/questions/46900430/firestore-getting-documents-id-from-collection
    this.fetchAvailableExercisesSubscription = (this.db.collection<Exercise>('availableExercises')
      .valueChanges({ idField: 'id' }) as Observable<Exercise[]>)
      .pipe(
        take(1),
        finalize(() => {
          this.guiService.isLoading = false
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this._availableExercises = [...exercises];
        this._onAvailableExercisesChanged.next();
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

  public fetchAttemptedExercises(): void {
    if (this.fetchAttemptedExercisesSubscription) {
      // console.log('TrainingService.fetchAttemptedExercises() unsubscribe');
      this.fetchAttemptedExercisesSubscription.unsubscribe();
      this.fetchAttemptedExercisesSubscription = null;
    }

    this.fetchAttemptedExercisesSubscription = this.db.collection<Exercise>('attemptedExercises')
      .valueChanges({ idField: 'id' })
      .subscribe((exercises: Exercise[]) => {
        // When anything is written to 'attemptedExercises' then this subscription is called automatically.
        // The current exercise will be first in the list if we are currently doing an exercise.
        if (this._exerciseStarted) {
          this._attemptedExercises = [{ ...this._attemptedExercises[0] }, ...exercises];
        } else {
          this._attemptedExercises = [...exercises];
        }

        this._onAttemptedExercisesChanged.next();
      });
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
    return this._onAvailableExercisesChanged;
  }

  get onAttemptedExercisesChanged(): Subject<void> {
    return this._onAttemptedExercisesChanged;
  }

  private getExerciseById(exerciseId: string): Exercise {
    return this._availableExercises.find((exercise: Exercise) => exercise.id === exerciseId);
  }

  public startExercise(exerciseId: string) {
    this._currentExercise = { ...this.getExerciseById(exerciseId) };
    this._currentExercise.status = ExerciseStatus.Busy;
    this._currentExercise.startDate = firebase.firestore.Timestamp.now();

    // Current exercise is inserted in the beginning of the array
    this._attemptedExercises.unshift(this._currentExercise);

    this._exerciseProgressPercentage = 0;
    this._exerciseStarted = true;
    this.startExerciseTimer();

    this._onExerciseStatusChanged.next();
    this._onAttemptedExercisesChanged.next();
  }

  private completeOrCancelExercise(status: ExerciseStatus, duration: number, calories: number, endDate: firebase.firestore.Timestamp): void {
    let newExercise: Exercise = new Exercise(
      this._currentExercise.id,
      this._currentExercise.name,
      duration,
      calories,
      status,
      this._currentExercise.startDate,
      endDate
    );

    this._exerciseProgressPercentage = 0;
    this._exerciseStarted = false;
    this._currentExercise = null;
    this.stopExerciseTimer();

    this.db.collection('attemptedExercises')
      .add(newExercise.objectToSave())
      .then((result: DocumentReference) => {
        // No need to work out the attemptedExercises array manually here, because the subscription to the 'attemptedExercises' collection,
        // in fetchAttemptedExercises, will be called and have the details of the newly added exercise.

        // this._attemptedExercises = this._attemptedExercises.map(
        //   (exercise: Exercise, idx: number) => {
        //     if (idx === 0) {
        //       newExercise.id = result.id;
        //       return newExercise;
        //       // The above is better, because it results in an actual Exercise object being added,
        //       // instead of an object that has the same properties as an Exercise
        //       // return { ...completedExercise, id: result.id };
        //     } else {
        //       return exercise;
        //     }
        //   }
        // );
        // console.log(this._attemptedExercises);

        this._onExerciseStatusChanged.next();
        this._onAttemptedExercisesChanged.next();
      });
  }

  public completeExercise() {
    this.completeOrCancelExercise(
      ExerciseStatus.Completed,
      this._currentExercise.duration,
      this._currentExercise.calories,
      firebase.firestore.Timestamp.now()
    );
  }

  public cancelExercise() {
    this.completeOrCancelExercise(
      ExerciseStatus.Cancelled,
      this._currentExercise.duration * (this._exerciseProgressPercentage / 100),
      this._currentExercise.calories * (this._exerciseProgressPercentage / 100),
      firebase.firestore.Timestamp.now()
    );
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
          if (idx === 0) {
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
      } else {
        this._onAttemptedExercisesChanged.next();
      }

      this._onExerciseProgressPercentageChanged.next(this._exerciseProgressPercentage);
    }, 1000);
  }

  private stopExerciseTimer() {
    clearInterval(this._exerciseProgressTimerId);
  }

  public unsubscribe() {
    // console.log('TrainingService.unsubscribe()');

    if (this.fetchAvailableExercisesSubscription) {
      this.fetchAvailableExercisesSubscription.unsubscribe();
      this.fetchAvailableExercisesSubscription = null;
      // console.log('fetchAvailableExercisesSubscription unsubscribed');
    }

    if (this.fetchAttemptedExercisesSubscription) {
      this.fetchAttemptedExercisesSubscription.unsubscribe();
      this.fetchAttemptedExercisesSubscription = null;
      // console.log('fetchAttemptedExercisesSubscription unsubscribed');
    }
  }
}
