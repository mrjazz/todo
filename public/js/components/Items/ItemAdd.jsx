import React, { Component, PropTypes } from 'react';


export default class ItemAdd extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

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
    // onUpdate
    return <input
              type="text"
              autoFocus="true"
              ref="ctrlInput"
              defaultValue={this.props.value}
              onBlur={this.props.onCancel}
              onKeyDown={this._inputHandler.bind(this)} />
  }
}
