import index from '../reducers';
import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware } from 'redux';
// import { createStore } from 'redux';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

export default function configureStore(initialState) {
	//const store = createStore(index, initialState);
  const store = createStoreWithMiddleware(index, initialState);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextReducer = require('../reducers');
			store.replaceReducer(nextReducer)
		});
	}

	return store;
}
