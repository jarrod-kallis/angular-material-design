import { Action } from '@ngrx/store';
import { Exercise } from '../exercise.model';

export const START_FETCHING_AVAILABLE_EXERCISES: string = 'START_FETCHING_AVAILABLE_EXERCISES';
export const SET_AVAILABLE_EXERCISES: string = 'SET_AVAILABLE_EXERCISES';
export const STOP_FETCHING_AVAILABLE_EXERCISES: string = 'STOP_FETCHING_AVAILABLE_EXERCISES';

export const START_FETCHING_ATTEMPTED_EXERCISES: string = 'START_FETCHING_ATTEMPTED_EXERCISES';
export const SET_ATTEMPTED_EXERCISES: string = 'SET_ATTEMPTED_EXERCISES';
export const STOP_FETCHING_ATTEMPTED_EXERCISES: string = 'STOP_FETCHING_ATTEMPTED_EXERCISES';

export const START_EXERCISE: string = 'START_EXERCISE';
export const START_EXERCISE_TIMER: string = 'START_EXERCISE_TIMER';
export const UPDATE_EXERCISE: string = 'UPDATE_EXERCISE';
export const START_COMPLETE_EXERCISE: string = 'START_COMPLETE_EXERCISE';
export const FINISH_COMPLETE_EXERCISE: string = 'FINISH_COMPLETE_EXERCISE';
export const START_CANCEL_EXERCISE: string = 'START_CANCEL_EXERCISE';
export const FINISH_CANCEL_EXERCISE: string = 'FINISH_CANCEL_EXERCISE';
export const PAUSE_EXERCISE: string = 'PAUSE_EXERCISE';
export const RESUME_EXERCISE: string = 'RESUME_EXERCISE';

export class StartFetchingAvailableExercises implements Action {
  readonly type: string = START_FETCHING_AVAILABLE_EXERCISES;
}

export class SetAvailableExercises implements Action {
  readonly type: string = SET_AVAILABLE_EXERCISES;

  // payload: Array of available exercises
  constructor(public payload: Exercise[]) { }
}

export class StopFetchingAvailableExercises implements Action {
  readonly type: string = STOP_FETCHING_AVAILABLE_EXERCISES;
}

export class StartFetchingAttemptedExercises implements Action {
  readonly type: string = START_FETCHING_ATTEMPTED_EXERCISES;
}

export class SetAttemptedExercises implements Action {
  readonly type: string = SET_ATTEMPTED_EXERCISES;

  // payload: Array of attempted exercises
  constructor(public payload: Exercise[]) { }
}

export class StopFetchingAttemptedExercises implements Action {
  readonly type: string = STOP_FETCHING_ATTEMPTED_EXERCISES;
}

export class StartExercise implements Action {
  readonly type: string = START_EXERCISE;

  // payload: Exercise id
  constructor(public payload: string) { }
}

export class StartExerciseTimer implements Action {
  readonly type: string = START_EXERCISE_TIMER;

  // payload: Exercise time id
  constructor(public payload: NodeJS.Timer) { }
}

// Update the current exercise
export class UpdateExercise implements Action {
  readonly type: string = UPDATE_EXERCISE;
}

export class StartCompleteExercise implements Action {
  readonly type: string = START_COMPLETE_EXERCISE;
}

export class FinishCompleteExercise implements Action {
  readonly type: string = FINISH_COMPLETE_EXERCISE;
}

export class StartCancelExercise implements Action {
  readonly type: string = START_CANCEL_EXERCISE;
}

export class FinishCancelExercise implements Action {
  readonly type: string = FINISH_CANCEL_EXERCISE;
}

export class PauseExercise implements Action {
  readonly type: string = PAUSE_EXERCISE;
}

export class ResumeExercise implements Action {
  readonly type: string = RESUME_EXERCISE;
}

export type TrainingActions = SetAvailableExercises | SetAttemptedExercises | StartExercise;
