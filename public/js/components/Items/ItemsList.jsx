import React, {Component, PropTypes} from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ItemAdd from './ItemAdd.jsx';
import Item from './Item.jsx';

import * as HighlightType from '../../constants/HighlightTypes';
import * as ItemIconTypes from '../../constants/ItemIconTypes';

import {filterr, searchrIndex, searchrByIndex, lengthr} from '../../lib/CollectionUtils.js';


export default class ItemsList extends Component {
  constructor() {
    super();
    this.state = {cards: [], focusId: null, editId: null, filter: 'all', highlightStyle: HighlightType.NONE};
    this.dropItem      = this.dropItem.bind(this);
    this.highlightItem = this.highlightItem.bind(this);
  }

  static propTypes = {
    items         : React.PropTypes.array.isRequired,
    moveAboveTodo : PropTypes.func.isRequired,
    moveBelowTodo : PropTypes.func.isRequired,
    checkTodo     : PropTypes.func.isRequired,
    updateTodo    : PropTypes.func.isRequired,
    flipTodo      : PropTypes.func.isRequired,
    makeChildOf   : PropTypes.func.isRequired
  };

  componentWillMount() {
    this.setState({
      items : this.props.items
    });
  }

  dropItem(id) {
    if (this.state.focusId !== null && this.state.focusId !== id) {
      // console.log(`drop ${id} ${this.state.highlightStyle} ${this.state.focusId}`);
      switch (this.state.highlightStyle) {
        case HighlightType.CURRENT:
          this.props.makeChildOf(id, this.state.focusId);
          break;
        case HighlightType.ABOVE:
          this.props.moveAboveTodo(id, this.state.focusId);
          break;
        case HighlightType.BELOW:
          this.props.moveBelowTodo(id, this.state.focusId);
          break;
      }

      this.highlightItem(id, HighlightType.CURRENT);
    }
  }

  render() {
    return <div className="todos" ref="self" onKeyDown={this._keyPressHandler.bind(this)}>
      <ul className="filters">
        {['all', 'completed', 'active'].map((title, key) =>
          <li key={key} className={this.state.filter === title ? 'active' : ''}>
            {this.state.filter === title ?
              title :
              <a href="#"
                onClick={() => {this._handleFilter(title)}}
                onKeyPress={() => {this._handleFilter(title)}}>
                {title}
              </a>
            }
          </li>
        )}
      </ul>
      <div className="all-items">
        {this._getItems(this._curItems())}
      </div>
    </div>
  }

  highlightItem(focusId, type) {
    // small optimization
    if (focusId === this.state.id && type == this.state.highlightStyle) return;
    this.setState(Object.assign(this.state, {highlightStyle: type, focusId}));
  }

  _getItems(items) {
    return items.map(
      (i, j) => <div key={j} className="items">
        <Item
          ref={j}
          className={this._stylesForItem(i)}
          todo={i}
          flipTodo={this.props.flipTodo}
          focus={this.state.focusId == i.id}
          dropItem={this.dropItem}
          highlight={this.highlightItem}
          onFocusOut={() => this._handleItemFocus(null)}
          onFocus={() => this._handleItemFocus(i.id)}
          onChange={() => this.props.checkTodo(i.id)}>
        {i.id == this.state.editId ?
          <ItemAdd
            value={i.text}
            onUpdate={this._handleUpdateItem.bind(this, i.id)}
            onFocusOut={this._handleCancelUpdate.bind(this, i.id)} />
          : <label onClick={this._handleItemFocus.bind(this, i.id)}>{i.text} - {i.id} - {j}</label>
        }
        </Item>
        {i.children != undefined && i.children.length > 0 && i.open ? this._getItems(i.children) : ''}
      </div>
    );
  }

  _curItems() {
    return filterr(this.props.items, (i) => {
      switch(this.state.filter) {
        case 'active':
          return !i.done;
        case 'completed':
          return i.done;
        default:
          return true;
      }
    });
  }

  _handleFilter(filter) {
    this.setState(Object.assign(this.state, {filter}));
  }

  _handleItemFocus(id) {
    this.setState(Object.assign(this.state, {focusId: id}));
  }

  _handleCancelUpdate(id) {
    this.setState(Object.assign(this.state, {editId: null}));
  }

  _handleUpdateItem(id, text) {
    console.log(this.state.editId);
    this.props.updateTodo(this.state.editId, text);
    this.setState(Object.assign(this.state, {editId: null, focusId: this.state.editId}));
  }

  _findIndexById(id) {
    return searchrIndex(this.props.items, function (i) { return i.id == id});
  }

  _findIdByIndex(index) {
    return searchrByIndex(this.props.items, index).id;
  }

  _keyPressHandler(e) {
    const key = e.key;

    if (key == 'ArrowUp' || key == 'ArrowDown') {
      // arrows handling
      if (this.state.focusId == null) return;
      let nextTodo = false;

      if (key == 'ArrowUp') nextTodo = lookupPrev(this._curItems(), this.state.focusId);
      if (key == 'ArrowDown') nextTodo = lookupNext(this._curItems(), this.state.focusId);

      if (nextTodo) {
        this.setState(Object.assign(this.state, {focusId: nextTodo.id}));
      }
    } else if (key == 'Enter') {
      this.setState(Object.assign(this.state, {editId: this.state.focusId}));
      e.stopPropagation();
      e.preventDefault();
    }
  }

  _stylesForItem(i) {
    let styles = ['item'];
    if (i.done) styles.push('complete');
    if (i.id == this.state.focusId) {
      switch (this.state.highlightStyle) {
        case HighlightType.ABOVE:
          styles.push('item-above');
          break;
        case HighlightType.BELOW:
          styles.push('item-below');
          break;
        default:
          styles.push('item-selected');
      }
    }
    return styles.join(' ');
  }
}

export default DragDropContext(HTML5Backend)(ItemsList)

// helper functions

export function lookupPrev(items, id) {
  return lookup(items, id, 1);
}

export function lookupNext(items, id) {
  return lookup(items, id, -1);
}

/**
 *
 * @param items
 * @param id
 * @param step for previous = 1, for next = -1
 * @returns Todo
 */
export function lookup(items, id, step = 1) {
  let prev = false;
  function process(items) {
    let cur = step > 0 ? 0 : items.length - 1;
    const last = step > 0 ? items.length : -1;
    while (cur != last) {
      // console.log(cur, prev ? prev.id : '-');
      if (step > 0 && items[cur].id === id) return prev; // make sense only for previous
      if (step > 0) prev = items[cur];
      if (items[cur].children && items[cur].open) {
        let result = process(items[cur].children);
        if (result) return result;
      }
      if (step < 0 && items[cur].id === id) return prev; // make sense only for next
      if (step < 0) prev = items[cur];
      cur += step;
    }
    return false;
  }
  return process(items);
}
