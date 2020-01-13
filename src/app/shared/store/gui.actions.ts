import { Action } from '@ngrx/store';

export const START_LOADING: string = 'START_LOADING';
export const STOP_LOADING: string = 'STOP_LOADING';

export class StartLoading implements Action {
  readonly type: string = START_LOADING;
}

export class StopLoading implements Action {
  readonly type: string = STOP_LOADING;
}

export type GuiActions = StartLoading | StopLoading;
