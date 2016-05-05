import React, { Component, PropTypes } from 'react';

import {HOWTO} from '../constants/Howto.jsx';
import Popup from 'react-popup';

export default class DetailsView extends Component {
  
  static propTypes = {
    appState: PropTypes.object.isRequired
  };

  render() {
    //this.props.appState.currentTodo.text
    //console.log(this.props.appState.currentTodo.text);
    return (<div>
                <a className="help float-right" onClick={() => Popup.alert(HOWTO)}>[?]</a>
                <p>Details</p>
                <div>
                  <input
                    type="text"
                    autoFocus="true"
                    ref="ctrlInput"
                    defaultValue={''}
                    />
                </div>
                <Popup />
            </div>);
  }
}
