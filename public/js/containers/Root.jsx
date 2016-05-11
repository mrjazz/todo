import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions/todos'

import ItemsView from '../containers/ItemsView.jsx';
import DetailsView from '../containers/DetailsView.jsx';

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { todos, store } = this.props;
    //   <ItemsView todos={todos} actions={actions}/>
    //
    return <Provider store={store}>
      <div>
        <ItemsView todos={todos} />
        <DetailsView todos={todos} />
      </div>
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
)(Root)
