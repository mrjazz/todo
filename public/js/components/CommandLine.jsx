import React, { Component, PropTypes } from 'react';
import {getCommandHint} from '../lib/hints';
import {validateCommand, execCommand} from '../lib/commands';
import {selectLastTodo} from '../actions/todos';

export default class CommandLine extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = { hint: getCommandHint() };
  }

  inputHandler(e) {
    switch (e.key) {
      case 'Enter':
        execCommand(this.refs.ctrlInput.value, this.context.store);
        break;
      case 'Tab':
        console.log("complete");
        break;
      case 'Escape':
        this.refs.ctrlInput.value = '';
        this.context.store.dispatch(selectLastTodo());
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

  render() {
    return <div className="command">
            <input
              id="cmd"
              type="text"
              placeholder="Enter command"
              autoFocus="true"
              ref="ctrlInput"
              onKeyUp={this.inputHandler.bind(this)}
              />
            <p>{this.state.hint}</p>
          </div>
  }

}
