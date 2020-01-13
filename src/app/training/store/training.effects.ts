import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap, take, switchMap, finalize, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import {
  START_FETCHING_AVAILABLE_EXERCISES, SetAvailableExercises, StopFetchingAvailableExercises,
  START_FETCHING_ATTEMPTED_EXERCISES, SetAttemptedExercises, StartExerciseTimer, START_EXERCISE,
  UPDATE_EXERCISE,
  StartCompleteExercise,
  START_COMPLETE_EXERCISE,
  FinishCompleteExercise,
  FINISH_COMPLETE_EXERCISE,
  START_CANCEL_EXERCISE,
  FinishCancelExercise,
  FINISH_CANCEL_EXERCISE,
  PAUSE_EXERCISE,
  RESUME_EXERCISE,
  UpdateExercise
} from './training.actions';
import { GuiService } from '../../shared/services/gui.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Exercise } from '../exercise.model';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingEffects {
  @Effect()
  fetchAllAvailableExercises$ = this.actions$
    .pipe(
      ofType(START_FETCHING_AVAILABLE_EXERCISES),
      tap(() => {
        this.guiService.isLoading = true;
      }),
      switchMap(() => {
        // { idField: 'id' }: Adds the id field to the valueChanges observable, otherwise it only returns the user-created data
        // https://stackoverflow.com/questions/46900430/firestore-getting-documents-id-from-collection
        return (this.db.collection<Exercise>('availableExercises')
          .valueChanges({ idField: 'id' }) as Observable<Exercise[]>)
          .pipe(
            take(1),
            // tap(() => { throw (new Error()); }),
            finalize(() => {
              this.guiService.isLoading = false;
            }),
            map((exercises: Exercise[]) => {
              return new SetAvailableExercises(exercises);
            }),
            catchError(() => {
              this.guiService.showSnackBar('Unable to load exercises', 'Okay')

              // of() creates a new observable (non-error observable) so that the overall observable doesn't die
              return of(new StopFetchingAvailableExercises());
            })
          )
      })
    );

  @Effect()
  fetchAttemptedExercises$ = this.actions$
    .pipe(
      ofType(START_FETCHING_ATTEMPTED_EXERCISES),
      tap(() => console.log('Problem with this effect and logging out')),
      switchMap(() => {
        return this.db.collection<Exercise>('attemptedExercises')
          .valueChanges({ idField: 'id' })
          .pipe(
            // take(1),
            withLatestFrom(this.store.select(fromTraining.getTrainingState)),
            map(([attemptedExercises, trainingState]: [Exercise[], fromTraining.TrainingState]) => {
              // console.log('Set Attempted Exercises Subscription:', trainingState, attemptedExercises);

              return new SetAttemptedExercises(trainingState.exerciseStarted ?
                [{ ...trainingState.attemptedExercises[0] }, ...attemptedExercises] :
                [...attemptedExercises]
              )
            })
          )
      })
    );

  @Effect()
  startResumeExercise$ = this.actions$
    .pipe(
      ofType(START_EXERCISE, RESUME_EXERCISE),
      map(() => {
        return new StartExerciseTimer(
          setInterval(() => {
            this.store.dispatch(new UpdateExercise());
          }, 1000)
        )
      })
    );

  @Effect()
  updateExercise$ = this.actions$
    .pipe(
      ofType(UPDATE_EXERCISE),
      withLatestFrom(this.store.select(fromTraining.getTrainingState)),
      map(([updateExercise, trainingState]) => {
        // console.log(updateExercise, trainingState);

        if (trainingState.exerciseProgressPercentage >= 100) {
          // Complete exercise
          return new StartCompleteExercise();
        }

        // Dummy action
        return { type: 'CONTINUE' };
      })
    );

  @Effect()
  startCompleteCancelExercise = this.actions$
    .pipe(
      ofType(START_COMPLETE_EXERCISE, START_CANCEL_EXERCISE),
      withLatestFrom(this.store.select(fromTraining.getTrainingState)),
      map(([startExercise, trainingState]) => {
        // console.log('Start Complete/Cancel Exercise Effect:', trainingState);

        this.db.collection('attemptedExercises')
          .add(trainingState.currentExercise.objectToSave());

        if (startExercise instanceof StartCompleteExercise) {
          return new FinishCompleteExercise();
        } else {
          return new FinishCancelExercise();
        }
      })
    );

  @Effect({ dispatch: false })
  finishCompleteCancelPauseExercise = this.actions$
    .pipe(
      ofType(FINISH_COMPLETE_EXERCISE, FINISH_CANCEL_EXERCISE, PAUSE_EXERCISE),
      withLatestFrom(this.store.select(fromTraining.getTrainingState)),
      map(([finishExercise, trainingState]) => {
        clearInterval(trainingState.exerciseProgressTimerId);
      }),
      // map(() => {
      //   console.log('Finished exercise, calling fetching again');
      //   return new StartFetchingAttemptedExercises();
      // })
    );

  constructor(
    private actions$: Actions,
    private guiService: GuiService,
    private db: AngularFirestore,
    private store: Store<fromRoot.State>
  ) { }
}
