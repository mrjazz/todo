import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root.jsx';
import configureStore from './store/configureStore';
import {saveState, loadState} from "./api/localStorage";
//import {loginUser, loginUserSuccess} from './actions/auth';

const store = configureStore(loadState());

let timer; // save not often than every two seconds
store.subscribe(() => {
  clearInterval(timer);
  timer = setTimeout(() => saveState(store.getState()), 2000);
});

// const token = localStorage.getItem('token');
// if (token !== null) {
//   store.dispatch(loginUserSuccess(token));
// } else {
//   loginUser("denis", "password")(store.dispatch);
// }

ReactDOM.render(
  <Root store={store}/>,
  document.getElementById('app')
);
