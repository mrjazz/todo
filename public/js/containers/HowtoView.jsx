import React, { Component } from 'react';


export default class HowtoView extends Component {
  render() {
    return <div className="howto">
            <strong>Tips for using the app:</strong>
            <ul>
              <li>Arrows (&#8593;, &#8595;) for navigation in list</li>
              <li>Space for toggle/untoggle todo item or filter</li>
              <li>Enter for edit todo item</li>
              <li>Tab/Shift+Tab for navigation between controls</li>
              <li>Drag&Drop for reorder</li>
            </ul>
            <p>v0.0.1</p>
          </div>
  }
}
