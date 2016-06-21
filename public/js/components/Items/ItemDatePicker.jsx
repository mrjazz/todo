import React, { Component } from 'react';

import * as Dates from '../../lib/dates';
import {getLocale} from '../../lib/i18n';
import {getDateHint} from '../../lib/hints';


export default class ItemDatePicker extends Component {

  state;

  constructor() {
    super();
    this.state = { date: null, error: null };
    this.locale = getLocale();
  }

  static propTypes = {
    onCancel: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired
  };

  inputHandler(e) {
    switch (e.key) {
      case 'Enter':
        if (this.state.date == null) {
          this.setState(Object.assign(this.state, {
            error: "Use correct date or ESC to cancel"
          }));
        } else if (this.props.minDate && Dates.isDateBefore(this.state.date, this.props.minDate)) {
          this.setState(Object.assign(this.state, {
            error: "End date can't be before start"
          }));
        } else if (this.props.maxDate && Dates.isDateAfter(this.state.date, this.props.maxDate)) {
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

  changeHandler() {
    const date = Dates.dateParse(this.refs.ctrlInput.value);
    this.setState(Object.assign(this.state, {
      date,
      error: date !== null ? null : this.state.error
    }));
  }

  render() {
    const date = this.state.date || this.props.date;

    const dateLabel = this.state.date != null ?
        Dates.dateFormatFull(this.state.date, this.locale) :
        getDateHint();

    const dateValue = date ? Dates.dateFormatShort(this.props.date) : null;

    return <div className="date-picker">
            <input
              placeholder={this.props.placeholder}
              type="text"
              autoFocus="true"
              ref="ctrlInput"
              defaultValue={dateValue}
              onBlur={this.props.onCancel}
              onChange={this.changeHandler.bind(this)}
              onKeyDown={this.inputHandler.bind(this)} />
              {this.state.error ? <span className="error">{this.state.error}</span> : ""}
            <p className={this.state.date == null ? '' : 'correct'}>{dateLabel}</p>
          </div>
  }
}
