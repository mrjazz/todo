import React, { Component, PropTypes } from 'react';
import {getCommandHint} from '../lib/hints';
import {validateCommand, execCommand} from '../lib/commands';
import {selectLastTodo} from '../actions/todos';
import {selectedCommandLine} from '../actions/app';

export default class CommandLine extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = { hint: getCommandHint() };
  }

  keyDownHandler(e) {
    switch (e.key) {
      case 'Escape':
        e.stopPropagation();
        e.preventDefault();

        this.refs.ctrlInput.value = '';
        this.context.store.dispatch(selectLastTodo());
        break;
    }
  }

  keyUpHandler(e) {
    switch (e.key) {
      case 'Enter':
        execCommand(this.refs.ctrlInput.value, this.context.store);
        break;
      case 'Tab':
        console.log("complete");
        break;
      default:
        if (this.refs.ctrlInput.value.trim() == '') {
          this.setState({ hint: getCommandHint() });
        } else {
          const commands = validateCommand(this.refs.ctrlInput.value);
          if (commands.length > 0) {
            this.setState({ hint: commands.join(', ') });
          }
        }
    }
  }

  focusHandler() {
    const store = this.context.store;
    store.dispatch(selectedCommandLine());
  }

  componentDidUpdate() {
    const store = this.context.store;
    if (store.getState().app.focusCommandLine) {
      this.refs.ctrlInput.focus();
    }
  }

  render() {
    return <div className="command">
            <input
              id="cmd"
              type="text"
              placeholder="Enter command"
              autoFocus="true"
              ref="ctrlInput"
              onFocus={this.focusHandler.bind(this)}
              onKeyUp={this.keyUpHandler.bind(this)}
              onKeyDown={this.keyDownHandler.bind(this)}
              />
            <p>{this.state.hint}</p>
          </div>
  }

}
