import React, { Component } from 'react';

import 'datejs';
import moment from 'moment';


export default class ItemDatePicker extends Component {

  state;

  constructor() {
    super();
    this.state = { date: null, error: null };
  }

  static propTypes = {
    onCancel: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired
  };

  _inputHandler(e) {
    switch (e.key) {
      case 'Enter':
        if (this.state.date == null) {
          this.setState(Object.assign(this.state, {
            error: "Use correct date or ESC to cancel"
          }));
        } else {
          this.props.onUpdate(this.state.date);
          this.refs.ctrlInput.value = '';
        }
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

  _changeHandler() {
    const date = Date.parse(this.refs.ctrlInput.value);
    this.setState(Object.assign(this.state, {
      date,
      error: date !== null ? null : this.state.error
    }));
  }

  render() {
    const date = this.state.date === null ? "" : moment(this.state.date).format('llll').toString();
    return <div className="date-picker">
            <input
              placeholder={this.props.placeholder}
              type="text"
              autoFocus="true"
              ref="ctrlInput"
              defaultValue={this.props.value}
              onBlur={this.props.onCancel}
              onChange={this._changeHandler.bind(this)}
              onKeyDown={this._inputHandler.bind(this)} />
              {this.state.error ? <span className="error">{this.state.error}</span> : ""}
            <p>{date}</p>
          </div>
  }
}
