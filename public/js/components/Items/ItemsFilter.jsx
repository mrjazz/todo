import React, {Component, PropTypes} from 'react';
import {updateFilter} from '../../actions/todos';
import * as FilterTypes from '../../constants/FilterTypes';

export default class ItemsFilter extends Component {

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
    const selectFilter = () => this.context.store.getState().todos.filter ?
      this.context.store.getState().todos.filter : FilterTypes.FILTER_ALL;
    return (<div className="todos">
              <ul className="filters">
                {[
                  FilterTypes.FILTER_ALL,
                  FilterTypes.FILTER_TODO,
                  FilterTypes.FILTER_ACTIVE,
                  FilterTypes.FILTER_COMPLETED,
                  FilterTypes.FILTER_BY_CONTEXT
                ].map((title, key) =>
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
            </div>);
  }

}
