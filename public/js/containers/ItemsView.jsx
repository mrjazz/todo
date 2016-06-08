import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ItemsList from '../components/Items/ItemsList.jsx';
import ItemAdd from '../components/Items/ItemAdd.jsx';

import {addTodo} from '../actions/todos';


export default class ItemsView extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const {dispatch} = this.props;
    return <div className="todo-view">
          <ItemAdd onUpdate={(text) => dispatch(addTodo(text))} />
          <ItemsList/>
        </div>
  }

}

function mapStateToProps(state) {
  return {todos: state.todos};
}

export default connect(mapStateToProps)(ItemsView);
