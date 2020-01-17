import { AuthActions, LOGGED_IN, LOGGED_OUT, AUTHENTICATING } from './auth.actions';

export interface State {
  isAuthenticating: boolean;
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticating: false,
  isAuthenticated: false
}

export function authReducer(state: State = initialState, action: AuthActions) {
  switch (action.type) {
    case AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: true
      }
    case LOGGED_IN:
      return {
        ...state,
        isAuthenticated: true,
        isAuthenticating: false
      };
    case LOGGED_OUT:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: false
      }
    default:
      return state;
  }
}

export const getIsAuthenticating = (state: State) => state.isAuthenticating;
export const getIsAuthenticated = (state: State) => state.isAuthenticated;
