import React, { Component, PropTypes } from 'react';

import {HOWTO} from '../constants/Howto.jsx';
import Popup from 'react-popup';

export default class DetailsView extends Component {

  render() {
    return (<div>
                <a className="help float-right" onClick={() => Popup.alert(HOWTO)}>[?]</a>
                <p>Details</p>
                <div>
                  <input
                    type="text"
                    autoFocus="true"
                    ref="ctrlInput"
                    defaultValue={this.props.value}
                    />
                </div>
                <Popup />
            </div>);
  }
}
