import * as Types from '../constants/TodoActionTypes';
import Todo from '../models/todo';
import {mapr, filterr, insertrAfter, insertrBefore} from '../lib/CollectionUtils.js';


const initialState = [
  new Todo(0, 'Learn React'),
  new Todo(1, 'Learn Redux', true, [
    new Todo(4, 'Read manual'),
    new Todo(5, 'Write the code')
  ]),
  new Todo(2, 'Learn HTML', true),
  new Todo(3, 'Learn CSS')
];

export function todos(state = initialState, action) {

  console.info(action);

  switch (action.type) {
    case Types.ADD_TODO:
      return [
        ...state,
        new Todo(state.length, action.text, false)
      ];

    case Types.CHECK_TODO:
      return mapr(state, (todo) => {
        return todo.id === action.id ?
            Object.assign(clone(todo), { done: !todo.done }) :
            todo;
      });

    case Types.UPDATE_TODO:
      return mapr(state, todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { text: action.text }) :
          todo
      );

    case Types.MOVE_ABOVE_TODO:
      return insert(insertrBefore, state, action.id, action.parentId);

    case Types.MOVE_BELOW_TODO:
      return insert(insertrAfter, state, action.id, action.parentId);

    case Types.DELETE_TODO:
      return [
        ...state.slice(0, action.index),
        ...state.slice(+action.index + 1)
      ];

    case Types.MAKE_CHILD_OF_TODO:
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

    case Types.REMOVE_TODO:
      return filterr(state, (todo) => {
        return todo.id !== action.id;
      });

    case Types.FLIP_TODO:
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
