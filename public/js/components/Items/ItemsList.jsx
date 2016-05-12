import React, {Component, PropTypes} from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ItemsFilter from './ItemsFilter.jsx';
import ItemAdd from './ItemAdd.jsx';
import Item from './Item.jsx';

import * as HighlightType from '../../constants/HighlightTypes';

import {getParentFor, isParentOf, searchr, filterr, searchrIndex, searchrByIndex} from '../../lib/CollectionUtils.js';
import * as TodoAction from '../../actions/todos';


export default class ItemsList extends Component {

  state;

  constructor() {
    super();
    this.state = {
      cards: [],
      editId: null,
      filter: 'all',
      highlightStyle: HighlightType.NONE,
      highlightId: null
    };
    this.dropItemHandler         = this.dropItemHandler.bind(this);
    this.highlightItem    = this.highlightItem.bind(this);
    this.handleFilter    = this.handleFilter.bind(this);
    this.itemKeyPressHandler = this.itemKeyPressHandler.bind(this);
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static propTypes = {
    todos: React.PropTypes.object.isRequired
  };

  render() {
    return <ItemsFilter onFilter={this.handleFilter}>
      {this.renderItems(this.curItems())}
    </ItemsFilter>;
  }

  renderItems(items) {
    return items.map(
      (i, j) => <div key={j} className="items">
        <Item
          ref={j}
          className={this.stylesForItem(i)}
          todo={i}
          focus={this.state.editId == null && this.props.todos.focusId == i.id}
          dropItem={this.dropItemHandler}
          highlight={this.highlightItem}
          onKeyDown={this.itemKeyPressHandler}
          onFocus={() => this.itemFocusHandler(i.id)}
          onFocusOut={() => this.focusOutHandler()}
          onChange={() => this.props.checkTodo(i.id)}
        >
          {i.id == this.state.editId ?
            <ItemAdd
              value={i.text}
              onUpdate={this.updateItemHandler.bind(this, i.id)}
              onFocusOut={this.updateCancelHandler.bind(this, i.id)} />
            : <label onClick={this.itemFocusHandler.bind(this, i.id)}>{i.text} - {i.id} - {j}</label>
          }
        </Item>
        {i.children != undefined && i.children.length > 0 && i.open ? this.renderItems(i.children) : ''}
      </div>
    );
  }

  dropItemHandler(id) {
    const highlightId = this.state.highlightId;
    const store = this.context.store;
    if (highlightId !== null) {
      // console.log(`drop ${id} ${this.state.highlightStyle} ${this.props.todos.focusId}`);

      if (isParentOf(this.curItems(), (i) => i.id == id, (i) => i.id == highlightId)) {
        console.log("Drop parent in children!");
        return;
      }

      switch (this.state.highlightStyle) {
        case HighlightType.HOVER:
          store.dispatch(makeChildOf(id, highlightId));
          break;
        case HighlightType.ABOVE:
          store.dispatch(moveAboveTodo(id, highlightId));
          break;
        case HighlightType.BELOW:
          store.dispatch(moveBelowTodo(id, highlightId));
          break;
      }

      this.setState(Object.assign(this.state, {highlightStyle: HighlightType.CURRENT, highlightId: null}));
      store.dispatch(TodoAction.selectTodo(id));
    }
  }

  highlightItem(focusId, type) {
    this.setState(Object.assign(
      this.state, {
        highlightStyle: type,
        highlightId: focusId
      }
    ));
  }

  focusOutHandler() {
    this.setState(Object.assign(
      this.state, {
        highlightStyle: this.props.todos.focusId !== null ? HighlightType.CURRENT : null
      }
    ));
    this.itemFocusHandler(null);
  }

  curState() {
    return this.context.store.getState().todos;
  }

  curItems() {
    return filterr(this.curState().todos, (i) => {
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

  handleFilter(filter) {
    this.setState(Object.assign(this.state, {filter}));
  }

  itemFocusHandler(id) {
    this.context.store.dispatch(TodoAction.selectTodo(id));
  }

  updateCancelHandler(id) {
    this.setState(Object.assign(this.state, {editId: null}));
  }

  updateItemHandler(id, text) {
    if (text != null) {
      this.context.store.dispatch(TodoAction.updateTodo(id, text));
    } else {
      this.context.store.dispatch(TodoAction.selectTodo(id));
    }
    //this._handleItemFocus(id);
    this.setState(Object.assign(this.state, {editId: null, highlightStyle: HighlightType.CURRENT}));
  }

  findIndexById(id) {
    return searchrIndex(this.curState().todos, function (i) { return i.id == id});
  }

  findIdByIndex(index) {
    return searchrByIndex(this.curState().todos, index).id;
  }

  itemKeyPressHandler(e) {
    const key = e.key;
    const store = this.context.store;

    // console.log(key);

    const todos = this.curItems();
    const id = this.curState().focusId;
    const setFocus = this.itemFocusHandler.bind(this); // need for passing in jumpOnTop()

    switch (key) {
      case 'Delete':
        let selNextTodo = lookupNext(todos, id); // next
        if (selNextTodo === false) {
          selNextTodo = lookupPrev(todos, id); // previous
        }
        store.dispatch(TodoAction.deleteTodo(id));
        store.dispatch(TodoAction.selectTodo(selNextTodo.id));
        break;
      case 'ArrowRight':
      case 'ArrowLeft':
        if (this.curState().focusId == null) return;

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
              store.dispatch(TodoAction.flipTodo(id));
            } else if (key == 'ArrowRight') {
              // if has children, jump to first item by arrowRight
              this.itemFocusHandler(todo.children[0].id);
            }
          } else { // is collapsed
            if (key == 'ArrowRight') {
              // if has children, expand by arrowRight
              store.dispatch(TodoAction.flipTodo(id));
            } else if (key == 'ArrowLeft') {
              console.log("jump on top");
              jumpOnTop();
            }
          }
          return;
        }

        jumpOnTop();
        break;


      case 'ArrowUp':
      case 'ArrowDown':

        // arrows handling (move up, move down)

        if (id == null) return; // if not focused
        let nextTodo = false;

        if (key == 'ArrowUp') nextTodo = lookupPrev(todos, id);
        if (key == 'ArrowDown') nextTodo = lookupNext(todos, id);

        if (nextTodo) {
          this.itemFocusHandler(nextTodo.id);
        }
        break;

      case 'Enter':
      case 'F2':
        // edit item
        this.setState(Object.assign(this.state, {editId: id, highlightStyle: HighlightType.HOVER}));
        e.stopPropagation();
        e.preventDefault();
        break;
    }
  }

  getHighlightCSS(style) {
    switch (style) {
      case HighlightType.HOVER:
        return 'item-hover';
      case HighlightType.ABOVE:
        return 'item-above';
      case HighlightType.BELOW:
        return 'item-below';
      default:
        return 'item-selected';
    }
  }

  stylesForItem(i) {
    let styles = ['item'];
    if (i.done) styles.push('complete');

    if (i.id == this.state.highlightId) {
      styles.push(this.getHighlightCSS(this.state.highlightStyle));
    } else if (i.id == this.state.editId) {
      styles.push(this.getHighlightCSS(HighlightType.HOVER));
    } else if (this.state.highlightId == null && i.id == this.curState().focusId) {
      // if item is highlighted do not highlight focused item
      styles.push(this.getHighlightCSS(this.state.highlightStyle));
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
 * Search next or previous items in tree of items
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
