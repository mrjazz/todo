import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react';
import markdown from 'markdown';


export default class Markdown extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired
  };

  render() {
    const html = { __html : markdown.markdown.toHTML(this.props.text) };
    return <div dangerouslySetInnerHTML={html}/>;
  }
}
