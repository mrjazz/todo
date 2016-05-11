import React, { Component, PropTypes } from 'react';

import {addTodo} from '../../actions/todos';


export default class ItemAdd extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  _inputHandler(e) {
    if (e.key == 'Enter') {
      //this.props.onAdd(this.refs.ctrlInput.value);
      this.props.onUpdate(this.refs.ctrlInput.value);
      
      this.refs.ctrlInput.value = '';

      e.stopPropagation();
      e.preventDefault();
    }
  }

  render() {
    // onUpdate
    return <input
              type="text"
              autoFocus="true"
              ref="ctrlInput"
              defaultValue={this.props.value}
              onBlur={this.props.onFocusOut}
              onKeyDown={this._inputHandler.bind(this)} />
  }
}
