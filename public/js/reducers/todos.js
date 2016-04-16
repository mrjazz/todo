import * as Types from '../constants/ActionTypes'
import Todo from '../models/todo'
import {mapr} from '../lib/CollectionUtils.js';


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
  console.info(action);

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
      console.log(action);
      const newState = mapr(state, (todo) => {
        return todo.id === action.id ?
            Object.assign({}, todo, { done: !todo.done }) :
            todo
      });
      return newState;

    case Types.UPDATE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, { text: action.text }) :
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
          return Object.assign({}, state[action.id2]);
        } else if (action.id2 == index) {
          return Object.assign({}, state[action.id1]);
        } else {
          return Object.assign({}, todo);
        }
      });

    default:
      return state;
  }
}
