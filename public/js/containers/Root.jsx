import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions/todos'

import TodoView from '../containers/TodoView.jsx';

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    todos: PropTypes.object.isRequired
  };

  render() {
    const { todos, store } = this.props;
    return <Provider store={store}>
            <Router history={browserHistory}>
              <Route path="/" component={TodoView}/>
            </Router>
          </Provider>
  }
}

function mapStateToProps(state) {
  return {todos: state.todos};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
