import * as TodoAction from '../constants/TodoActionTypes';
import Todo from '../models/todo';
import {lengthr, mapr, filterr, insertrAfter, insertrBefore} from '../lib/CollectionUtils.js';


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
    const id = lengthr(state.todos) + 1;
    state.lastInsertId = id;
    return id;
  }

  switch (action.type) {
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

    case TodoAction.ADD_ABOVE:
      state.cancelId = state.focusId;
      state.todos = insertrBefore(state.todos, new Todo(newId(), action.text), (i) => i.id == action.id);
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
