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
        } else if (this.props.minDate && moment(this.state.date).isBefore(this.props.minDate)) {
          this.setState(Object.assign(this.state, {
            error: "End date can't be before start"
          }));
        } else if (this.props.maxDate && moment(this.state.date).isAfter(this.props.maxDate)) {
          this.setState(Object.assign(this.state, {
            error: "Start date can't be after end"
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
    const options = [
      "today", "tomorrow", "July 2008", "next friday",
      "last April", "2004.08.07", "6/4/2005", "8:15 PM",
      "22:30:45", "+5years", "t + 5 d (today + 5 days)",
      "t (today)", "n (now)"
    ];

    const hint = options[Math.floor(Math.random() * options.length)];

    const date = this.state.date === null ?
      `You can use something like "${hint}"` :
      moment(this.state.date).format('llll').toString();

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
            <p className={this.state.date == null ? '' : 'correct'}>{date}</p>
          </div>
  }
}
