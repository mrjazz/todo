import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ItemsList from '../components/Items/ItemsList.jsx';
import CommandLine from '../components/CommandLine.jsx';


export default class ItemsView extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  render() {
    return <div className="todo-view">
          <CommandLine/>
          <ItemsList/>
        </div>
  }

}

function mapStateToProps(state) {
  return {todos: state.todos};
}

export default connect(mapStateToProps)(ItemsView);
