import React, { Component, PropTypes } from 'react';


export default class ItemGroup extends Component {  

  render() {   
    return <p>{this.props.children}</p>
  }

}