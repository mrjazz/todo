import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root.jsx';

import {loginUser, loginUserSuccess} from './actions/auth';

import configureStore from './store/configureStore';

const store = configureStore();

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
