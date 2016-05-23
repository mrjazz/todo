import React, { Component, PropTypes } from 'react';

import {HOWTO} from '../constants/Howto.jsx';

import {searchr} from '../lib/CollectionUtils.js';

export default class DetailsView extends Component {

  // static propTypes = {
  //   todosState: PropTypes.object.isRequired
  // };

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
  }

  render() {
    return <div className="howto">{HOWTO}</div>;
  }

/*  render() {
    const state = this.props.todosState;

    let title = '';

    if (state.todos) {
      const todo = searchr(state.todos, function (i) {
        return i.id == state.focusId
      });
      title = todo.text;
    }

    return (<div>
                <a className="help float-right" onClick={() => Popup.alert(HOWTO)}>[?]</a>
                <p>Details</p>
                <div>
                  <input
                    type="text"
                    autoFocus="true"
                    ref="ctrlInput"
                    value={title}
                    onChange={this._handleChange}
                    />
                </div>
                <Popup />
            </div>);
  }*/

  _handleChange(e) {
    if (!this.props.todosState.focusId) {
      return;
    }
    this.props.todoActions.updateTodo(this.props.todosState.focusId, e.target.value);
  }

}
