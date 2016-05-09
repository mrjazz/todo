import { combineReducers } from 'redux';
import { todos } from './todos';
import { app } from './app';


const rootReducer = combineReducers({
  todos
  //app
  // no sense for additional reducers for now
});

export default rootReducer;
