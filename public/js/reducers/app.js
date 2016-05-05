import * as Types from '../constants/AppActionTypes';
import Todo from '../models/todo';


const initialState = {
  current: false
};

export function app(state = initialState, action) {

  console.info(action);

  switch (action.type) {
    default:
      return state;
  }
}
