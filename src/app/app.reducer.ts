import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import guiReducer, * as fromGui from './shared/store/gui.reducer';
import authReducer, * as fromAuth from './auth/store/auth.reducer';
// Can't have training stuff here, because it's lazy loaded
// import trainingReducer, * as fromTraining from './training/store/training.reducer';

export interface State {
  gui: fromGui.State;
  auth: fromAuth.State;
  // training: fromTraining.State;
}

export const reducers: ActionReducerMap<State> = {
  gui: guiReducer,
  auth: authReducer,
  // training: trainingReducer
};

export const getGuiState = createFeatureSelector<fromGui.State>('gui');
export const getIsLoading = createSelector(getGuiState, fromGui.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticating = createSelector(getAuthState, fromAuth.getIsAuthenticating);
export const getIsAuthenticated = createSelector(getAuthState, fromAuth.getIsAuthenticated);

// export const getTrainingState = createFeatureSelector<fromTraining.State>('training');
// export const getAvailableExercises = createSelector(getTrainingState, fromTraining.getAvailableExercises);
// export const getAttemptedExercises = createSelector(getTrainingState, fromTraining.getAttemptedExercises);
// export const getExerciseStarted = createSelector(getTrainingState, fromTraining.getExerciseStarted);
// export const getExerciseProgressPercentage = createSelector(getTrainingState, fromTraining.getExerciseProgressPercentage);
