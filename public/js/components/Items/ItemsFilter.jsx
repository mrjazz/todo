import React, {Component, PropTypes} from 'react';
import {updateFilter} from '../../actions/todos';

export default class ItemsList extends Component {

  constructor() {
    super();
    this.state = {
      filter: 'all'
    };
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  handleFilter(filter) {
    this.context.store.dispatch(updateFilter(filter));
  }

  render() {
    const selectFilter = () => this.context.store.getState().todos.filter;
    return <div className="todos">
      <ul className="filters">
        {['all', 'current', 'completed', 'active'].map((title, key) =>
          <li key={key} className={selectFilter() === title ? 'active' : ''}>
            {selectFilter() === title ?
              title :
              <a href="#"
                 onClick={() => this.handleFilter(title)}
                 onKeyPress={() => this.handleFilter(title)}>
                {title}
              </a>
            }
          </li>
        )}
      </ul>
      <div className="all-items">
        {this.props.children}
      </div>
    </div>
  }

}
