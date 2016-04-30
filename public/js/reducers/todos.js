import * as Types from '../constants/ActionTypes';
import Todo from '../models/todo';
import {mapr, filterr} from '../lib/CollectionUtils.js';


const initialState = [
  new Todo(0, 'Learn React'),
  new Todo(1, 'Learn Redux', true, [
    new Todo(4, 'Read manual'),
    new Todo(5, 'Write the code'),
  ]),
  new Todo(2, 'Learn HTML', true),
  new Todo(3, 'Learn CSS')
];

export function todos(state = initialState, action) {
  //console.info(action);

  switch (action.type) {
    case Types.ADD_TODO:
      return [
        ...state, {
          id: state.length,
          text: action.text,
          done: false
        }
      ];

    case Types.CHECK_TODO:
      return mapr(state, (todo) => {
        return todo.id === action.id ?
            Object.assign(Object.create(todo), todo, { done: !todo.done }) :
            todo;
      });

    case Types.UPDATE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { text: action.text }) :
          todo
      );

    case Types.DELETE_TODO:
      return [
        ...state.slice(0, action.index),
        ...state.slice(+action.index + 1)
      ];

    case Types.SWAP_TODOS:
      return state.map((todo, index) => {
        if (action.id1 == index) {
          return Object.assign(Object.create(state[action.id2]), state[action.id2]);
        } else if (action.id2 == index) {
          return Object.assign(Object.create(state[action.id1]), state[action.id1]);
        } else {
          return Object.assign(Object.create(todo), todo);
        }
      });

    case Types.MAKE_CHILD_OF_TODO:
      let item;
      const filtered = filterr(state, (todo) => {
        if (todo.id === action.id) {
          item = Object.assign(Object.create(todo), todo);
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


    case Types.REMOVE_TODO:
      return filterr(state, (todo) => {
        return todo.id !== action.id;
      });

    default:
      return state;
  }
}
