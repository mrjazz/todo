import * as TodoAction from '../constants/TodoActionTypes';
import Todo from '../models/todo';
import {callr, searchr, mapr, filterr, insertrAfter, insertrBefore} from '../lib/CollectionUtils.js';


const initialState = {
  focusId: null,
  lastInsertId: null,
  cancelId: null,
  todos: [
    new Todo(0, 'Learn React'),
    new Todo(1, 'Learn Redux', true, [
      new Todo(4, 'Read manual'),
      new Todo(5, 'Write the code')
    ]),
    new Todo(2, 'Learn HTML', true),
    new Todo(3, 'Learn CSS')
  ]
};

export function todos(state = initialState, action) {

  // console.info(action);

  return processFullState(
    Object.assign(clone(state), {
      todos   : processItemsAction(state.todos, action),
      focusId : processFocusAction(state.focusId, action)
    }),
    action
  );
}

function processFullState(state, action) {

  function newId() {
    let max = 0;
    callr(state.todos, (i) => max = i.id > max ? i.id : max);
    state.lastInsertId = max + 1;
    return state.lastInsertId;
  }

  switch (action.type) {

    case TodoAction.COLLAPSE_ALL:
      state.todos = mapr(state.todos, (todo) => {
        return todo.open ?
          Object.assign(clone(todo), { open: false }) :
          todo;
      });

      // if current item in children, we should set focus on top level parent of it
      for (let i in state.todos) {
        if (state.todos[i].id == state.focusId) break;
        if (searchr(state.todos[i].children, (todo) => todo.id === state.focusId)) {
            state.focusId = state.todos[i].id;
            break;
        }
      }
      break;

    case TodoAction.EXPAND_ALL:
      state.todos = mapr(state.todos, (todo) => {
        return todo.children.length > 0 ?
          Object.assign(clone(todo), { open: true }) :
          todo;
      });
      break;

    case TodoAction.ADD_AS_CHILD:
      state.cancelId = state.focusId;
      state.todos = mapr(state.todos, (i) => {
        if (i.id === action.id) {
          i.children = [
            ...i.children,
            new Todo(newId(), action.text, false)
          ];
        }
        return i;
      });
      break;

    case TodoAction.ADD_TODO:
      state.todos = [
        ...state,
        new Todo(newId(), action.text, false)
      ];
      break;

    case TodoAction.ADD_BELOW:
      state.cancelId = state.focusId;
      state.todos = insertrAfter(state.todos, new Todo(newId(), action.text), (i) => i.id == action.id);
      break;

    case TodoAction.CANCEL_CREATE:
      state.todos = filterr(state.todos, (i) => i.id !== state.lastInsertId);
      state.focusId = state.cancelId;
      state.cancelId = null;
      break;

    case TodoAction.UPDATE_TODO:
      state.cancelId = null;
      break;
  }

  return state;
}

function processFocusAction(state, action) {
  switch (action.type) {
    case TodoAction.SELECT_TODO:
      return action.id;
    case TodoAction.UPDATE_TODO:
      return action.id;
    default:
      return state;
  }
}

function processItemsAction(state, action) {
  switch (action.type) {

    case TodoAction.CHECK_TODO:
      return mapr(state, (todo) => {
        return todo.id === action.id ?
            Object.assign(clone(todo), { done: !todo.done }) :
            todo;
      });

    case TodoAction.UPDATE_TODO:
      return mapr(state, todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { text: action.text }) :
          todo
      );

    case TodoAction.MOVE_ABOVE_TODO:
      return insert(insertrBefore, state, action.id, action.parentId);

    case TodoAction.MOVE_BELOW_TODO:
      return insert(insertrAfter, state, action.id, action.parentId);

    case TodoAction.DELETE_TODO:
      return filterr(state, (i) => i.id !== action.id);

    case TodoAction.MAKE_CHILD_OF_TODO:
      return (
        () => {
          let item = false;
          const filtered = filterr(state, (todo) => {
            if (todo.id === action.id) {
              item = clone(todo);
              return false;
            } else {
              return true;
            }
          });

          return mapr(filtered, (todo) => {
            if (item && todo.id === action.parentId) {
              todo.add(item);
            }
            return todo;
          });
        }
      )();

    case TodoAction.REMOVE_TODO:
      return filterr(state, (todo) => {
        return todo.id !== action.id;
      });

    case TodoAction.FLIP_TODO:
      return mapr(state, (todo) => {
        return todo.id === action.id ? Object.assign(Object.create(todo), todo, {open: !todo.open}) : todo;
      });

    default:
      return state;
  }
}

function clone(o) {
  return Object.assign(Object.create(o), o);
}

function insert(fnInsert, items, id, parentId) {
  let item = false;
  const filtered = filterr(items, (todo) => {
    if (todo.id === id) {
      item = clone(todo);
      return false;
    } else {
      return true;
    }
  });
  return fnInsert(filtered, item, (i) => i.id == parentId);
}
