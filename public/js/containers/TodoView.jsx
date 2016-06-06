import React, { Component, PropTypes } from 'react';

import ItemsView from '../containers/ItemsView.jsx';
import DetailsView from '../containers/DetailsView.jsx';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions/todos'


export default class TodoView extends Component {

  static propTypes = {
    todos: PropTypes.object.isRequired
  };

  render() {
    return <div className="todo-view">
            <ItemsView />
            <DetailsView />
          </div>
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
)(TodoView);
