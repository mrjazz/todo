import React, {Component, PropTypes} from 'react';
import { createSelector } from 'reselect';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ItemDatePicker from './ItemDatePicker.jsx';
import ItemsFilter from './ItemsFilter.jsx';
import ItemNote from './ItemNote.jsx';
import ItemAdd from './ItemAdd.jsx';
import Item from './Item.jsx';

import Todo from '../../models/Todo';

import * as TodoItemStateType from '../../constants/TodoItemStateTypes';
import * as HighlightType from '../../constants/HighlightTypes';
import * as FilterTypes from '../../constants/FilterTypes';

import {transformTodos} from '../../lib/todoTransformations';
import {getParentFor, isParentOf, searchr, findr, filterr, findrIndex, findrByIndex} from '../../lib/collectionUtils.js';
import * as TodoAction from '../../actions/todos';
import * as AppAction from '../../actions/app';


export default class ItemsList extends Component {

  state;

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      // cards: [],
      focusedItemState: TodoItemStateType.VIEW,
      prevKey: null,
      editId: null,
      dropHoverStyle: HighlightType.NONE,
      dropHoverId: null
    };

    this.selectTodos  = () => this.curState().todos;
    this.selectFilter = () => this.curState().filter;

    this.curItems = createSelector(
      [this.selectTodos, this.selectFilter],
      (todos, filter) => {
        return applyFilter(todos, filter);
      }
    );
  }

  render() {

    let counter = 0;
    const store = this.context.store;

    // console.log(this.curState().filter);

    const renderItems = (items) => {
      return items.map(
        (i, j) => (<div key={j}>
                    <Item
                      ref={j}
                      className={this.stylesForItem(i, counter++)}
                      todo={i}
                      focus={this.state.editId == null && this.curState().focusId == i.id}
                      visible={this.isTodoVisible(i)}
                      onDrop={this.dropItemHandler.bind(this)}
                      highlight={this.highlightItem.bind(this)}
                      onKeyDown={this.itemKeyPressHandler.bind(this)}
                      onFocus={() => this.itemFocusHandler(i.id)}
                      onFocusOut={() => this.focusOutHandler()}
                      onChange={() => this.props.checkTodo(i.id)}
                      onFlipTodo={() => store.dispatch(TodoAction.flipTodo(i.id))}
                      onCheckTodo={() => {
                        this.keepPositionAfterAction(i.id, () => store.dispatch(TodoAction.checkTodo(i.id)));
                      }}
                    >
                      {this.getItemComponent(i)}
                    </Item>
                    {i.children != undefined && i.children.length > 0 && i.open ?
                     <div className="items">{renderItems(i.children)}</div>
                     : ''}
                  </div>)
      );
    };

    return (
      <ItemsFilter>
        {renderItems(this.curItems())}
        <p className="debug">focusedItemState: {this.state.focusedItemState},
          focusId: {this.curState().focusId},
          editId:  {this.state.editId},
          dropId:  {this.state.dropHoverId},
          dropStyle: {this.state.dropHoverStyle}</p>
      </ItemsFilter>
    );
  }

  keepPositionAfterAction(id, action) {
    let idx = this.findIndexById(id); // index before action
    action();
    let newId = false;
    while (true) {
      newId = this.findIdByIndex(idx--);
      if (newId != undefined || idx < 0) break;
    }
    if (newId != undefined) {
      // set focus if item exists
      this.context.store.dispatch(TodoAction.selectTodo(newId));
    }
  }

  isTodoVisible(todo) {
    if (todo.id === this.state.editId) {
      if (this.state.focusedItemState === TodoItemStateType.DATE_START) return true;
      if (this.state.focusedItemState === TodoItemStateType.DATE_END) return true;
      if (this.state.focusedItemState === TodoItemStateType.NOTE) return true;
      if (this.state.focusedItemState !== TodoItemStateType.VIEW) return false;
    }
    return true;
  }

  getItemComponent(todo) {
    if (todo.id === this.state.editId) {
      switch (this.state.focusedItemState) {
        case TodoItemStateType.NOTE:
          return <ItemNote
            value={todo.note}
            onUpdate={(note) => {
              this.context.store.dispatch(TodoAction.updateNote(todo.id, note));
              this.updateCancelHandler(todo.id);
            }}
            onCancel={this.updateCancelHandler.bind(this, todo.id)}/>;
        case TodoItemStateType.CREATE:
          return <ItemAdd
                    value={todo.text}
                    onUpdate={this.createItemHandler.bind(this, todo.id)}
                    onCancel={this.createCancelHandler.bind(this, todo.id)} />;
        case TodoItemStateType.EDIT:
          return <ItemAdd
                    value={todo.text}
                    onUpdate={this.updateItemHandler.bind(this, todo.id)}
                    onCancel={this.updateCancelHandler.bind(this, todo.id)} />;
        case TodoItemStateType.DATE_START:
          return <ItemDatePicker
                    placeholder="Start date"
                    date={todo.dateStart}
                    maxDate={todo.dateEnd}
                    onUpdate={(date) => {
                      // console.info(date); // dispatch update
                      this.context.store.dispatch(TodoAction.updateDateStart(todo.id, date));
                      this.updateCancelHandler(todo.id);
                    }}
                    onCancel={this.updateCancelHandler.bind(this, todo.id)}/>;
        case TodoItemStateType.DATE_END:
          return <ItemDatePicker
                    placeholder="End date"
                    date={todo.dateEnd}
                    minDate={todo.dateStart}
                    onUpdate={(date) => {
                      // console.info(date); // dispatch update
                      this.context.store.dispatch(TodoAction.updateDateEnd(todo.id, date));
                      this.updateCancelHandler(todo.id);
                    }}
                    onCancel={this.updateCancelHandler.bind(this, todo.id)}/>;
      }
    }

    return '';
  }

  dropItemHandler(id) {
    const highlightId = this.state.dropHoverId;
    const store = this.context.store;
    if (highlightId !== null) {

      // console.log(`drop ${id} ${this.state.dropHoverStyle} ${this.props.todos.focusId}`);

      if (isParentOf(this.curItems(), (i) => i.id == id, (i) => i.id == highlightId)) {
        console.warn("Drop parent in children!");
        return;
      }

      switch (this.state.dropHoverStyle) {
        case HighlightType.HOVER:
          store.dispatch(TodoAction.makeChildOf(id, highlightId));
          break;
        case HighlightType.ABOVE:
          store.dispatch(TodoAction.moveAboveTodo(id, highlightId));
          break;
        case HighlightType.BELOW:
          store.dispatch(TodoAction.moveBelowTodo(id, highlightId));
          break;
      }

      this.updateState({dropHoverStyle: HighlightType.CURRENT, dropHoverId: null});
      store.dispatch(TodoAction.selectTodo(id));
    }
  }

  highlightItem(focusId, type) {
    this.updateState({
      dropHoverStyle: type,
      dropHoverId: focusId
    });
  }

  focusOutHandler() {
    this.updateState({
      dropHoverStyle: this.curState().focusId !== null ? HighlightType.CURRENT : null
    });
    this.itemFocusHandler(null);
  }

  curState() {
    return this.context.store.getState().todos;
  }

  itemFocusHandler(id) {
    this.context.store.dispatch(TodoAction.selectTodo(id));
  }

  updateCancelHandler(id) {
    this.cancelEdit();
    this.itemFocusHandler(id);
  }

  updateItemHandler(id, text) {
    if (text != null) {
      this.context.store.dispatch(TodoAction.updateTodo(id, text));
    } else {
      this.context.store.dispatch(TodoAction.selectTodo(id));
    }

    //this._handleItemFocus(id);
    this.cancelEdit();
  }

  cancelEdit() {
    this.updateState({
      editId: null,
      focusedItemState: TodoItemStateType.VIEW
    });
  }

  createItemHandler(id, text) {
    this.context.store.dispatch(TodoAction.updateTodo(id, text));
    this.updateState({
      editId: null,
      dropHoverId: null,
      focusedItemState: TodoItemStateType.VIEW
    });
  }

  createCancelHandler() {
    this.context.store.dispatch(TodoAction.cancelCreateTodo());
    this.cancelEdit();
  }

  findIndexById(id) {
    return findrIndex(this.curItems(), function (i) { return i.id == id});
  }

  findIdByIndex(index) {
    return findrByIndex(this.curItems(), index).id;
  }

  itemKeyPressHandler(e) {
    const key = e.key;

    const store = this.context.store;

    const todos = this.curItems();
    const id = this.curState().focusId;

    const setFocus = this.itemFocusHandler.bind(this); // need for passing in jumpOnTop()

    function focusedTodo() {
      return findr(todos, function (i) {
        return i.id == id
      });
    }

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

    // Shortcut functions

    const keyMap = {

      'CtrlD' : () => {
        // Duplicate item
        const curTodo = focusedTodo();
        e.stopPropagation();
        e.preventDefault();

        store.dispatch(TodoAction.addBelow(id, curTodo));
        store.dispatch(TodoAction.selectTodo(this.curState().lastInsertId));
      },

      'Home' : () => {
        // Jump to begin
        if (todos.length > 0) {
          store.dispatch(TodoAction.selectTodo(todos[0].id));
        }
      },

      'End' : () => {
        // Jump to end
        if (todos.length > 0) {
          store.dispatch(TodoAction.selectTodo(todos[todos.length - 1].id));
        }
      },

      'Delete' : () => {
        // Delete item
        this.keepPositionAfterAction(id, () => store.dispatch(TodoAction.deleteTodo(id)));
      },

      'CtrlShiftArrowRight' : () => {
        // Expand
        store.dispatch(TodoAction.expandAll());
      },

      'CtrlShiftArrowLeft' : () => {
        // Collapse
        store.dispatch(TodoAction.collapseAll());
      },

      'CtrlArrowLeft' : () => {
        // Move item on level up
        const parent = getParentFor(todos, (i) => i.id == id);
        // console.log(`Move {id} item above {parent.id}`);
        if (parent) {
          store.dispatch(TodoAction.moveBelowTodo(id, parent.id));
        }
      },

      'CtrlArrowRight' : () => {
        const parent = lookupPrev(todos, id);
        if (parent) {
          store.dispatch(TodoAction.makeChildOf(id, parent.id)); // move item

          if (!parent.open) { // expand parent if closed
            store.dispatch(TodoAction.flipTodo(parent.id));
          }
        }
      },

      'ArrowRight' : () => {
        // Left or Right keys
        if (this.curState().focusId == null) return;

        const todo = focusedTodo();

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
              jumpOnTop();
            }
          }
          return;
        }

        jumpOnTop();
      },

      'ArrowLeft' : () => {
        keyMap.ArrowRight();
      },

      'ArrowUp' : () => {

        if (this.start) {
          // console.info(new Date().getTime() - this.start);
        }
        this.start = new Date().getTime();

        // arrows handling (move up, move down)
        if (id == null) return; // if not focused
        let nextTodo = false;

        if (key == 'ArrowUp') nextTodo = lookupPrev(todos, id);
        if (key == 'ArrowDown') nextTodo = lookupNext(todos, id);

        if (nextTodo) {
          this.itemFocusHandler(nextTodo.id);
        }
      },

      'ArrowDown' : () => {
        keyMap.ArrowUp();
      },

      'Enter' : () => {
        if (e.altKey) {
          // [Alt + Enter] add as child
          const curTodo = focusedTodo();

          if (!curTodo.open) { // expand current item if it's closed
            store.dispatch(TodoAction.flipTodo(id));
          }

          store.dispatch(TodoAction.addAsChild(id, ''));
        } else {
          // [Enter] add below current item
          store.dispatch(TodoAction.addBelow(id, ''));
        }

        const newId = this.curState().lastInsertId;
        this.updateState({
          editId: newId,
          dropHoverId: newId,
          focusedItemState: TodoItemStateType.CREATE
        });
      },

      'AltEnter' : () => {
        keyMap.Enter();
      },

      'F2' : () => {
        // edit item
        this.updateState({
          editId: id,
          focusedItemState: TodoItemStateType.EDIT
        });
        e.stopPropagation();
        e.preventDefault();
      },

      'CtrlArrowUp' : () => {
        const prev = lookupPrev(todos, id); // previous
        if (prev) {
          store.dispatch(TodoAction.moveAboveTodo(id, prev.id));
        }
      },

      'CtrlArrowDown' : () => {
        const next = lookupNext(todos, id); // next
        if (next) {
          store.dispatch(TodoAction.moveBelowTodo(id, next.id));
        }
      },

      'CtrlX' : () => {
        const nextTodo = this.prevOrNext(todos, id);
        store.dispatch(TodoAction.cutTodo(id));
        if (nextTodo) {
          this.itemFocusHandler(nextTodo.id);
        }
      },

      'CtrlV' : () => {
        store.dispatch(TodoAction.pasteTodo());
      },

      'CtrlAltV' : () => {
        store.dispatch(TodoAction.pasteAsChildTodo(id));
      },

      'CtrlC' : () => {
        store.dispatch(TodoAction.copyTodo(id));
      },

      'N_N' : () => {
        this.updateState({
          editId: id,
          focusedItemState: TodoItemStateType.NOTE,
          prevKey: null
        });
        e.stopPropagation();
        e.preventDefault();

        // hide preview if displayed
        const curTodo = focusedTodo();
        if (curTodo.previewNote) {
          store.dispatch(TodoAction.previewNote(id));
        }
      },

      'N_P' : () => {
        const curTodo = focusedTodo();
        if (curTodo.note != null) {
          store.dispatch(TodoAction.previewNote(id));
          this.updateState({prevKey: null});
        }
      },

      'Escape' : () => {
        const curTodo = focusedTodo();
        if (curTodo.note && curTodo.previewNote) {
          store.dispatch(TodoAction.previewNote(id));
        } else {
          e.stopPropagation();
          e.preventDefault();
          store.dispatch(AppAction.selectCommandLine());
        }
      },

      'D_S' : () => {
        this.updateState({
          editId: id,
          focusedItemState: TodoItemStateType.DATE_START,
          prevKey: null
        });
        e.stopPropagation();
        e.preventDefault();
      },

      'D_E' : () => {
        this.updateState({
          editId: id,
          focusedItemState: TodoItemStateType.DATE_END,
          prevKey: null
        });
        e.stopPropagation();
        e.preventDefault();
      }

    };

    const shortcut = getShortcut(e);
    // console.log(shortcut);
    if(keyMap[shortcut]) {
      keyMap[shortcut](); // process shortcut if exists
    } else if (
      this.state.prevKey &&
      ((new Date()).getTime() - this.state.prevKey.time < 1000) &&
      keyMap[this.state.prevKey.shortcut + "_" + shortcut]
    ) {
      keyMap[this.state.prevKey.shortcut + "_" + shortcut](); // process double shortcut
    } else {
      const prevKey = {
        shortcut: shortcut,
        time: (new Date()).getTime()
      };
      this.updateState({prevKey: prevKey});
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

  stylesForItem(item, counter) {
    let styles = ['item', counter % 2 ? 'odd' : 'even'];

    if (item.id == this.state.editId) {
      // create/edit item
      styles.push(this.getHighlightCSS(HighlightType.HOVER));
    } else if (item.id == this.state.dropHoverId) {
      // hover style during drag&drop
      styles.push(this.getHighlightCSS(this.state.dropHoverStyle));
    } else if (item.id == this.curState().focusId) {
      // selected item
      styles.push('item-selected');
    } else if (item.id == this.curState().lastFocusId) {
      styles.push('item-last');
    }

    return styles.join(' ');
  }

  updateState(stateProps) {
    this.setState(Object.assign(this.state, stateProps));
  }

  prevOrNext(todos, id) {
    let selNextTodo = lookupPrev(todos, id); // previous
    if (selNextTodo === false) {
      selNextTodo = lookupNext(todos, id); // next
    }
    return selNextTodo;
  }

  nextOrPrev(todos, id) {
    let selNextTodo = lookupNext(todos, id); // next
    if (selNextTodo === false) {
      selNextTodo = lookupPrev(todos, id); // previous
    }
    return selNextTodo;
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

function applyFilter(todos, filter) {
  const now = new Date();
  switch(filter) {
    case FilterTypes.FILTER_TODO:
      return transformTodos(todos, {searchBy: (i) =>
        (!Array.isArray(i.children) || i.children.length == 0) &&
        !i.done &&
        (!i.dateStart || i.dateStart < now)
      });

    case FilterTypes.FILTER_ACTIVE:
      return transformTodos(todos, {filterBy: (i) => i.done});

    case FilterTypes.FILTER_COMPLETED:
      return transformTodos(todos, {searchBy: (i) => i.done});

    case FilterTypes.FILTER_BY_CONTEXT:
      return transformTodos(todos, {
        filterBy: (i) =>
          (!Array.isArray(i.children) || i.children.length == 0) &&
          !i.done &&
          (!i.dateStart || i.dateStart < now),
        groupBy: (i) => i.text.match(/#(\S*)/g)
      });

    default:
      return todos;
  }
}

function getShortcut(e) {
  let result = '';
  if (e.ctrlKey) result += 'Ctrl';
  if (e.altKey) result += 'Alt';
  if (e.shiftKey) result += 'Shift';

  if (e.key !== "Unidentified") {
    if (e.key !== "Alt" && e.key !== "Control" && e.key !== "Shift") {
      result += e.key.length > 1 ? e.key : e.key.toUpperCase();
    }
  } else {
    result += String.fromCharCode(e.keyCode).toUpperCase();
  }

  return result;
}
