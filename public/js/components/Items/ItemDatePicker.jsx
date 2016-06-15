import React, { Component } from 'react';

import 'datejs';
import moment from 'moment';

import {getLocale} from '../../lib/i18n';

const LOCALE = getLocale();

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
      "t (today)", "n (now)", "+2h (in 2 hours)"
    ];

    const hint = options[Math.floor(Math.random() * options.length)];

    const date = this.state.date || this.props.date;

    const dateLabel = this.state.date != null ?
        moment(this.state.date).locale(LOCALE).format('llll').toString() :
        `You can use something like "${hint}"`;

    const dateValue = date ? moment(this.props.date).locale(LOCALE).format('LLL') : null;

    return <div className="date-picker">
            <input
              placeholder={this.props.placeholder}
              type="text"
              autoFocus="true"
              ref="ctrlInput"
              defaultValue={dateValue}
              onBlur={this.props.onCancel}
              onChange={this._changeHandler.bind(this)}
              onKeyDown={this._inputHandler.bind(this)} />
              {this.state.error ? <span className="error">{this.state.error}</span> : ""}
            <p className={this.state.date == null ? '' : 'correct'}>{dateLabel}</p>
          </div>
  }
}
