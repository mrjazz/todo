import React, { Component, PropTypes } from 'react';
import {HOWTO} from '../constants/Howto.jsx';


export default class DetailsView extends Component {

  render() {
    return <div className="howto">{HOWTO}</div>;
  }

}
