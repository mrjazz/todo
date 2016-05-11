import React, { Component, PropTypes } from 'react';

import ItemsList from '../components/Items/ItemsList.jsx';
import ItemAdd from '../components/Items/ItemAdd.jsx';

export default class ItemsView extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    console.log(this.context.store.getState().todos);
    return <div className="todo-view">
            <ItemAdd/>
            <ItemsList todos={this.context.store.getState().todos}/>
          </div>
  }
}

/*
 todos={todosState}
 selectTodo={todoActions.selectTodo}
 checkTodo={todoActions.checkTodo}
 moveBelowTodo={todoActions.moveBelowTodo}
 moveAboveTodo={todoActions.moveAboveTodo}
 makeChildOf={todoActions.makeChildOf}
 updateTodo={todoActions.updateTodo}
 flipTodo={todoActions.flipTodo}
 */
