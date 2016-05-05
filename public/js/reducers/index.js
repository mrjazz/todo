import { combineReducers } from 'redux';
import { todos } from './todos';
import { app } from './app';


const rootReducer = combineReducers({
  todos,
  app
});

export default rootReducer;
