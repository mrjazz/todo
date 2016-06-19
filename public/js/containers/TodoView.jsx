import React, { Component, PropTypes } from 'react';

import ItemsView from '../containers/ItemsView.jsx';
import DetailsView from '../containers/DetailsView.jsx';


export default class TodoView extends Component {

  render() {
    return (<div className="todo-view">
              <ItemsView />
              <DetailsView />
            </div>);
  }
}
