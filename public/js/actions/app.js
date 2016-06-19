import * as AppAction from '../constants/AppActionTypes';

export function selectCommandLine() {
  return { type: AppAction.SELECT_CMD };
}

export function selectedCommandLine() {
  return { type: AppAction.SELECTED_CMD };
}
