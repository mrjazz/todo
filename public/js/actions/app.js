import * as AppAction from '../constants/AppActionTypes';


export function selectTodo(todo) {
  return {
    type: AppAction.SELECT_TODO,
    todo
  };
}
