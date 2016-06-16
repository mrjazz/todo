import React, { Component, PropTypes } from 'react';
import {getCommandHint} from '../lib/hints';
import {validateCommand} from '../lib/commands';


export default class CommandLine extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  inputHandler(e) {
    switch (e.key) {
      case 'Enter':
        console.log("do");
        break;
      case 'Tab':
        console.log("complete");
        break;
      case 'Escape':
        this.refs.ctrlInput.value = '';
        break;
      default:
        validateCommand(this.refs.ctrlInput.value);
    }
  }


  render() {
    const hint = getCommandHint();
    return <div className="command">
            <input
              type="text"
              placeholder="Enter command"
              autoFocus="true"
              ref="ctrlInput"
              onKeyUp={this.inputHandler.bind(this)}
              />
            <p>{hint}</p>
          </div>
  }

}
