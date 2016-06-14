import React, {Component, PropTypes} from 'react';

export default class ItemsList extends Component {

  constructor() {
    super();
    this.state = {
      filter: 'all'
    };
  }

  static propTypes = {
    onFilter: React.PropTypes.func.isRequired
  };

  handleFilter(filter) {
    this.setState(Object.assign(this.state, {filter}));
    this.props.onFilter(filter);
  }

  render() {
    return <div className="todos">
      <ul className="filters">
        {['all', 'current', 'completed', 'active'].map((title, key) =>
          <li key={key} className={this.state.filter === title ? 'active' : ''}>
            {this.state.filter === title ?
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
