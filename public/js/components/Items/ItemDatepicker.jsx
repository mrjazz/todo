import React, { Component } from 'react';


export default class ItemDatePicker extends Component {

  _inputHandler(e) {
    switch (e.key) {
      case 'Enter':
        this.props.onUpdate(this.refs.ctrlInput.value);
        this.refs.ctrlInput.value = '';
        e.stopPropagation();
        e.preventDefault();
        break;
      case 'Escape':
        //this.props.onAdd(this.refs.ctrlInput.value);
        this.props.onCancel();
        this.refs.ctrlInput.value = '';
        e.stopPropagation();
        e.preventDefault();
        break;
    }
  }

  render() {
    return <input
              type="text"
              autoFocus="true"
              ref="ctrlInput"
              defaultValue={this.props.value}
              onBlur={this.props.onCancel}
              onKeyDown={this._inputHandler.bind(this)} />
  }
}
