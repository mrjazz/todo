import React, { Component, PropTypes } from 'react';

import {HOWTO} from '../constants/Howto.jsx';
import Popup from 'react-popup';

export default class DetailsView extends Component {

  static propTypes = {
    appState: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
  }


  render() {
    //console.log(this.props.appState.currentTodo);
    const title = this.props.appState.currentTodo != null ? this.props.appState.currentTodo.text : '';
    return (<div>
                <a className="help float-right" onClick={() => Popup.alert(HOWTO)}>[?]</a>
                <p>Details</p>
                <div>
                  <input
                    type="text"
                    autoFocus="true"
                    ref="ctrlInput"
                    value={title}
                    onChange={this._handleChange}
                    />
                </div>
                <Popup />
            </div>);
  }

  _handleChange(e) {
    if (!this.props.appState.currentTodo) {
      return;
    }
    this.props.todoActions.updateTodo(this.props.appState.currentTodo.id, e.target.value);
  }

}
