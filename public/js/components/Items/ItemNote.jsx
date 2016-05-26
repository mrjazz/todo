import React, { Component } from 'react';


export default class ItemNote extends Component {

  static propTypes = {
    onUpdate: React.PropTypes.func.isRequired
  };

  _inputHandler(e) {
    if (e.key == 'Enter' && e.ctrlKey) {
      this.props.onUpdate(this.refs.ctrlInput.value);
      this.refs.ctrlInput.value = '';
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key == 'Escape') {
      this.props.onCancel();
      this.refs.ctrlInput.value = '';
      e.stopPropagation();
      e.preventDefault();
    }
  }

  render() {
    return <div className="wrap">
            <div className="block"></div>
            <div className="control">
              <p className="hint">You can use <a href="https://en.wikipedia.org/wiki/Markdown" target="_blank">Markdown</a> for notes. (Esc - Cancel, Ctrl + Enter - Save)</p>
              <textarea
                defaultValue={this.props.value}
                placeholder="Enter your note here"
                type="text"
                autoFocus="true"
                ref="ctrlInput"
                onBlur={this.props.onCancel}
                onKeyDown={this._inputHandler.bind(this)}></textarea>
            </div>
          </div>
  }
}
