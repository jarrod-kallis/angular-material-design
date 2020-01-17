import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { Exercise, ExerciseStatus } from '../exercise.model';
import {
  START_EXERCISE, TrainingActions, SET_AVAILABLE_EXERCISES, SET_ATTEMPTED_EXERCISES,
  START_EXERCISE_TIMER, UPDATE_EXERCISE, START_COMPLETE_EXERCISE, FINISH_COMPLETE_EXERCISE, START_CANCEL_EXERCISE, FINISH_CANCEL_EXERCISE
} from './training.actions';
import * as fromRoot from '../../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  attemptedExercises: Exercise[];
  currentExercise: Exercise;
  exerciseStarted: boolean;
  exerciseProgressTimerId: NodeJS.Timer;
  exerciseProgressPercentage: number;
}

// A pattern to merge a lazily loaded module's ngrx state with the global state
export interface State extends fromRoot.State {
  training: TrainingState
}

const initialState: TrainingState = {
  availableExercises: [],
  attemptedExercises: [],
  currentExercise: null,
  exerciseStarted: false,
  exerciseProgressTimerId: null,
  exerciseProgressPercentage: 0
}

export function trainingReducer(state: TrainingState = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_EXERCISES: {
      return {
        ...state,
        availableExercises: [...action.payload]
      }
    }
    case SET_ATTEMPTED_EXERCISES: {
      return {
        ...state,
        attemptedExercises: [...action.payload]
      }
    }
    case START_EXERCISE: {
      let currentExercise: Exercise = { ...state.availableExercises.find((exercise: Exercise) => exercise.id === action.payload) };
      currentExercise.status = ExerciseStatus.Busy;
      currentExercise.startDate = firebase.firestore.Timestamp.now();

      const attemptedExercises = [currentExercise, ...state.attemptedExercises];

      return {
        ...state,
        attemptedExercises,
        currentExercise,
        exerciseProgressPercentage: 0,
        exerciseStarted: true
      }
    }
    case START_EXERCISE_TIMER: {
      return {
        ...state,
        exerciseProgressTimerId: action.payload
      }
    }
    case UPDATE_EXERCISE: {
      let exerciseProgressPercentage = Math.ceil(state.exerciseProgressPercentage + (1 / state.currentExercise.duration * 100));
      if (exerciseProgressPercentage >= 100) {
        exerciseProgressPercentage = 100;
      }

      const attemptedExercises = state.attemptedExercises.map(
        (exercise: Exercise, idx: number) => {
          if (idx === 0) {
            return new Exercise(
              state.currentExercise.id,
              state.currentExercise.name,
              state.currentExercise.duration * (state.exerciseProgressPercentage / 100),
              state.currentExercise.calories * (state.exerciseProgressPercentage / 100),
              state.currentExercise.status,
              state.currentExercise.startDate,
              state.currentExercise.endDate
            );
          } else {
            return exercise;
          }
        }
      );

      return {
        ...state,
        exerciseProgressPercentage,
        attemptedExercises
      }
    }
    case START_COMPLETE_EXERCISE:
    case START_CANCEL_EXERCISE: {
      let currentExercise: Exercise = null;
      if (action.type === START_COMPLETE_EXERCISE) {
        currentExercise = new Exercise(
          state.currentExercise.id,
          state.currentExercise.name,
          state.currentExercise.duration,
          state.currentExercise.calories,
          ExerciseStatus.Completed,
          state.currentExercise.startDate,
          firebase.firestore.Timestamp.now()
        );
      } else {
        currentExercise = new Exercise(
          state.currentExercise.id,
          state.currentExercise.name,
          state.currentExercise.duration * (state.exerciseProgressPercentage / 100),
          state.currentExercise.calories * (state.exerciseProgressPercentage / 100),
          ExerciseStatus.Cancelled,
          state.currentExercise.startDate,
          firebase.firestore.Timestamp.now()
        );
      }

      return {
        ...state,
        currentExercise: currentExercise,
        exerciseStarted: false,
        exerciseProgressPercentage: 0
      }
    }
    case FINISH_COMPLETE_EXERCISE:
    case FINISH_CANCEL_EXERCISE: {
      return {
        ...state,
        currentExercise: null
      }
    }
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getAttemptedExercises = createSelector(getTrainingState, (state: TrainingState) => state.attemptedExercises);
export const getExerciseStarted = createSelector(getTrainingState, (state: TrainingState) => state.exerciseStarted);
export const getExerciseProgressPercentage = createSelector(getTrainingState, (state: TrainingState) => state.exerciseProgressPercentage);
