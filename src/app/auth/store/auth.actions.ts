import { Action } from '@ngrx/store';

export const LOGGED_IN: string = 'LOGGED_IN';
export const LOGGED_OUT: string = 'LOGGED_OUT';

// Set to true when we are trying to figure out if a user is logged in or not.
// Happens when the user first loads the app. Sort of a loading indicator.
export const AUTHENTICATING: string = 'AUTHENTICATING';

export class LoggedIn implements Action {
  readonly type: string = LOGGED_IN;
}

export class LoggedOut implements Action {
  readonly type: string = LOGGED_OUT;
}

export class Authenticating implements Action {
  readonly type: string = AUTHENTICATING;
}

export type AuthActions = LoggedIn | LoggedOut | Authenticating;
