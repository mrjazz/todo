import * as AppAction from '../constants/AppActionTypes';
import AppState from '../models/AppState';


export function app(state = new AppState(), action) {

  // console.info(action);

  switch (action.type) {
    case AppAction.SELECT_TODO:
      return Object.assign(Object.create(state), state, { currentTodo: action.todo });
    default:
      return state;
  }
}
