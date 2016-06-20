import React, { Component, PropTypes } from 'react';


export default class RawHtml extends Component {

  static propTypes = {
    html: PropTypes.string.isRequired
  };

  render() {
    const html = { __html : this.props.html };
    return <div className={this.props.className} dangerouslySetInnerHTML={html}/>;
  }
}
