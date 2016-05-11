import React, {Component, PropTypes} from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ItemAdd from './ItemAdd.jsx';
import Item from './Item.jsx';

import * as HighlightType from '../../constants/HighlightTypes';
// import * as ItemIconTypes from '../../constants/ItemIconTypes';

import {getParentFor, isParentOf, searchr, filterr, searchrIndex, searchrByIndex} from '../../lib/CollectionUtils.js';
import {moveBelowTodo, moveAboveTodo, makeChildOf, selectTodo, updateTodo, flipTodo} from '../../actions/todos';


export default class ItemsList extends Component {

  constructor() {
    super();
    this.state = {cards: [], editId: null, filter: 'all', highlightStyle: HighlightType.NONE};
    this.dropItem      = this.dropItem.bind(this);
    this.highlightItem = this.highlightItem.bind(this);
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static propTypes = {
    todos: React.PropTypes.object.isRequired
  }

  // static propTypes = {
  //   todos         : React.PropTypes.object.isRequired,
  //   selectTodo    : PropTypes.func.isRequired,
  //   moveAboveTodo : PropTypes.func.isRequired,
  //   moveBelowTodo : PropTypes.func.isRequired,
  //   checkTodo     : PropTypes.func.isRequired,
  //   updateTodo    : PropTypes.func.isRequired,
  //   flipTodo      : PropTypes.func.isRequired,
  //   makeChildOf   : PropTypes.func.isRequired
  // };

  // componentWillMount() {
  //   this.setState({
  //     items : null
  //   });
  // }

  dropItem(id) {
    if (this._curState().focusId !== null && this._curState().focusId !== id) {
      // console.log(`drop ${id} ${this.state.highlightStyle} ${this.props.todos.focusId}`);

      if (isParentOf(this._curItems(), (i) => i.id == id, (i) => i.id == this._curState().focusId)) {
        console.log("Drop parent in children!");
        return;
      }

      switch (this.state.highlightStyle) {
        case HighlightType.CURRENT:
          this.context.store.dispatch(makeChildOf(id, this._curState().focusId));
          break;
        case HighlightType.ABOVE:
          this.context.store.dispatch(moveAboveTodo(id, this._curState().focusId));
          break;
        case HighlightType.BELOW:
          this.context.store.dispatch(moveBelowTodo(id, this._curState().focusId));
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
    this.setState(Object.assign(this.state, {highlightStyle: type}));
    this.context.store.dispatch(selectTodo(focusId));
  }

  _getItems(items) {
    return items.map(
      (i, j) => <div key={j} className="items">
        <Item
          ref={j}
          className={this._stylesForItem(i)}
          todo={i}
          focus={/*this.props.todos.focusId == i.id*/ false}
          dropItem={this.dropItem}
          highlight={this.highlightItem}
          onFocus={() => this._handleItemFocus(i.id)}
          //flipTodo={this.props.flipTodo}
          // onFocusOut={() => this._handleItemFocus(null)}
          // onChange={() => this.props.checkTodo(i.id)}
        >
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

  _curState() {
    return this.context.store.getState().todos;
  }

  _curItems() {
    return filterr(this._curState().todos, (i) => {
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
    this.context.store.dispatch(selectTodo(id));
  }

  _handleCancelUpdate(id) {
    this.setState(Object.assign(this.state, {editId: null}));
  }

  _handleUpdateItem(id, text) {
    this.context.store.dispatch(updateTodo(id, text));
    //this._handleItemFocus(id);
    this.setState(Object.assign(this.state, {editId: null}));
  }

  _findIndexById(id) {
    return searchrIndex(this._curState().todos, function (i) { return i.id == id});
  }

  _findIdByIndex(index) {
    return searchrByIndex(this._curState().todos, index).id;
  }

  _keyPressHandler(e) {
    const key = e.key;

    const todos = this._curItems();
    const id = this._curState().focusId;
    const setFocus = this._handleItemFocus.bind(this); // need for passing in jumpOnTop()

    if (key == 'ArrowRight' || key == 'ArrowLeft') {
      if (this._curState().focusId == null) return;

      const todo = searchr(todos, function (i) {
        return i.id == id
      });

      function jumpOnTop() { // need for avoid code duplication
        if (key == 'ArrowLeft') {
          // if item has parent, jump to parent by arrowLeft
          const parent = getParentFor(todos, (i) => i.id == id);
          if (parent) {
            setFocus(parent.id);
          } else {
            setFocus(todos[0].id);
          }
        }
      }

      if (todo.children.length > 0) {
        if (todo.open) { // is expanded
          if (key == 'ArrowLeft') {
            // if has children, collapse by arrowLeft
            this.context.store.dispatch(flipTodo(id));
          } else if (key == 'ArrowRight') {
            // if has children, jump to first item by arrowRight
            this._handleItemFocus(todo.children[0].id);
          }
        } else { // is collapsed
          if (key == 'ArrowRight') {
            // if has children, expand by arrowRight
            this.context.store.dispatch(flipTodo(id));
          } else if (key == 'ArrowLeft') {
            console.log("jump on top");
            jumpOnTop();
          }
        }
        return;
      }

      jumpOnTop();

    } else if (key == 'ArrowUp' || key == 'ArrowDown') {
      // arrows handling
      if (id == null) return; // if not focused
      let nextTodo = false;

      if (key == 'ArrowUp') nextTodo = lookupPrev(todos, id);
      if (key == 'ArrowDown') nextTodo = lookupNext(todos, id);

      if (nextTodo) {
        this._handleItemFocus(nextTodo.id);
        // this.setState(Object.assign(this.state, {focusId: nextTodo.id}));
      }
    } else if (key == 'Enter') {
      this.setState(Object.assign(this.state, {editId: id}));
      e.stopPropagation();
      e.preventDefault();
    }
  }

  _stylesForItem(i) {
    let styles = ['item'];
    if (i.done) styles.push('complete');
    if (i.id == this._curState().focusId) {
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
