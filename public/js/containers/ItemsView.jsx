import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';

import ItemsList from '../components/Items/ItemsList.jsx';
import ItemAdd from '../components/Items/ItemAdd.jsx';


export default class ItemsView extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired
  };

  render() {
    const { todos, todoActions, appActions } = this.props;
    return (<div className="todo-view">
                <ItemAdd onUpdate={todoActions.addTodo}/>
                <ItemsList
                  items={todos}
                  selectTodo={appActions.selectTodo}
                  checkTodo={todoActions.checkTodo}
                  moveBelowTodo={todoActions.moveBelowTodo}
                  moveAboveTodo={todoActions.moveAboveTodo}
                  makeChildOf={todoActions.makeChildOf}
                  updateTodo={todoActions.updateTodo}
                  flipTodo={todoActions.flipTodo}/>
            </div>)
  }
}
