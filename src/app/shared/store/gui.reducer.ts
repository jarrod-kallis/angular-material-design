import { START_LOADING, STOP_LOADING, GuiActions } from './gui.actions';

export interface State {
  isLoading: boolean
}

const initialState: State = {
  isLoading: false
};

export function guiReducer(state: State = initialState, action: GuiActions) {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export const getIsLoading = (state: State) => state.isLoading;
