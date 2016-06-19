import { combineReducers } from 'redux';
import { todos } from './todos';
import { app } from './app';
import { auth } from './auth';


const rootReducer = combineReducers({
  todos,
  auth,
  app
  // no sense for additional reducers for now
});

export default rootReducer;
