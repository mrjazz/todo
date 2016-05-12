import React, { Component, PropTypes } from 'react';

import {addTodo} from '../../actions/todos';


export default class ItemAdd extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  _inputHandler(e) {
    switch (e.key) {
      case 'Enter':
      case 'Escape':
        //this.props.onAdd(this.refs.ctrlInput.value);
        this.props.onUpdate(e.key == 'Enter' ? this.refs.ctrlInput.value : null);
        this.refs.ctrlInput.value = '';
        e.stopPropagation();
        e.preventDefault();
        break;
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
