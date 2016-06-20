import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react';
import markdown from 'markdown';
import RawHtml from './RawHtml';


export default class Markdown extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired
  };

  render() {
    return (<RawHtml html={markdown.markdown.toHTML(this.props.text)}/>);
    // const html = { __html : markdown.markdown.toHTML(this.props.text) };
    // return <div dangerouslySetInnerHTML={html}/>;
  }
}
