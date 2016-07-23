import * as AppAction from '../constants/AppActionTypes';

const initialState = {
  focusCommandLine: false
};

const updateState = (state, props) => Object.assign(Object.create(state), state, props);


export function app(state = initialState, action = {}) {

  // console.info(action);

  switch (action.type) {
    case AppAction.SELECT_CMD:
      return updateState(state, { focusCommandLine: true });
    case AppAction.SELECTED_CMD:
      return updateState(state, { focusCommandLine: false });
    default:
      return state;
  }

}
