import React, { Component, PropTypes } from 'react';

import {HOWTO} from '../constants/Howto.jsx';
import Popup from 'react-popup';

export default class DetailsView extends Component {

  render() {
    return (<div>
                <a className="help" onClick={() => Popup.alert(HOWTO)}>[?]</a>
                <p>Details</p>
                <Popup />
            </div>);
  }
}
