import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';


import TodoView from '../containers/TodoView.jsx';

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return <Provider store={store}>
            <Router history={browserHistory}>
              <Route path="/" component={TodoView}/>
              <Route path="/todo" component={TodoView}/>
            </Router>
          </Provider>
  }
}
