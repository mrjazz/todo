import { createStore } from 'redux';
import index from '../reducers';


export default function configureStore(initialState) {
	const store = createStore(index, initialState);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextReducer = require('../reducers');
			store.replaceReducer(nextReducer)
		})
	}

	return store
}
