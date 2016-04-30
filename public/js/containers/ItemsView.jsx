import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';

import ItemsList from '../components/Items/ItemsList.jsx';
import ItemAdd from '../components/Items/ItemAdd.jsx';


export default class ItemsView extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }

  render() {
    const { todos, actions } = this.props;
    return (<div className="todo-view">
                <ItemAdd onUpdate={actions.addTodo}/>
                <ItemsList
                  items={todos}
                  checkTodo={actions.checkTodo}
                  swapTodos={actions.swapTodos}
                  makeChildOf={actions.makeChildOf}
                  updateTodo={actions.updateTodo}/>
            </div>)
  }
}
