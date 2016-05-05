import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions/todos';
import * as AppActions from '../actions/app';

import ItemsView from '../containers/ItemsView.jsx';
import DetailsView from '../containers/DetailsView.jsx';


export default class Root extends Component {
  render() {
    const { store, todosState, todoActions, appActions } = this.props;
    console.log(this.props);
    // <Provider store={store}>
    //   <ItemsView todos={todos} actions={actions}/>
    // </Provider>
    return <div>
            <ItemsView todos={todosState} todoActions={todoActions} appActions={appActions}/>
            <DetailsView/>
          </div>
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  todosState: PropTypes.array.isRequired,
  todoActions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  // console.log(state);
  return {
    todosState : state.todos,
    appState   : state.app
  };
}

function mapDispatchToProps(dispatch) {
  return {
    todoActions : bindActionCreators(TodoActions, dispatch),
    appActions  : bindActionCreators(AppActions, dispatch)
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Root)
