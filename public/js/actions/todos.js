import * as types from '../constants/ActionTypes';


export function addTodo(text) {
  return {
    type: types.ADD_TODO,
    text
  };
}

export function checkTodo(id) {
  return {
    type: types.CHECK_TODO,
    id
  };
}

export function updateTodo(id, text) {
  return {
    type: types.UPDATE_TODO,
    id,
    text
  };
}

export function moveAboveTodo(id, parentId) {
  return {
    type: types.MOVE_ABOVE_TODO,
    id,
    parentId
  };
}

export function moveBelowTodo(id, parentId) {
  return {
    type: types.MOVE_BELOW_TODO,
    id,
    parentId
  };
}

export function removeTodo(id) {
  return {
    type: types.REMOVE_TODO,
    id
  };
}

export function makeChildOf(id, parentId) {
  return {
    type: types.MAKE_CHILD_OF_TODO,
    id,
    parentId
  };
}
