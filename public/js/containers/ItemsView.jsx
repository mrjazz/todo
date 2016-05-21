import React, { Component, PropTypes } from 'react';

import ItemsList from '../components/Items/ItemsList.jsx';
import ItemAdd from '../components/Items/ItemAdd.jsx';

import {addTodo} from '../actions/todos';

export default class ItemsView extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const store = this.context.store;
    return <div className="todo-view">
          <ItemAdd onUpdate={(text) => store.dispatch(addTodo(text))} />
          <ItemsList/>
        </div>
  }
}
