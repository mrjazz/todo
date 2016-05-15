import * as TodoAction from '../constants/TodoActionTypes';

export function deleteTodo(id) {
  return {
    type: TodoAction.DELETE_TODO,
    id
  };
}

export function expandAll() {
  return {
    type: TodoAction.EXPAND_ALL
  };
}

export function collapseAll() {
  return {
    type: TodoAction.COLLAPSE_ALL
  };
}

export function addTodo(text) {
  return {
    type: TodoAction.ADD_TODO,
    text
  };
}

export function cancelCreateTodo() {
  return {
    type: TodoAction.CANCEL_CREATE
  };
}

export function addBelow(id, text) {
  return {
    type: TodoAction.ADD_BELOW,
    id,
    text
  };
}

export function addAsChild(id, text) {
  return {
    type: TodoAction.ADD_AS_CHILD,
    id,
    text
  };
}

export function checkTodo(id) {
  return {
    type: TodoAction.CHECK_TODO,
    id
  };
}

export function updateTodo(id, text) {
  return {
    type: TodoAction.UPDATE_TODO,
    id,
    text
  };
}

export function moveAboveTodo(id, parentId) {
  return {
    type: TodoAction.MOVE_ABOVE_TODO,
    id,
    parentId
  };
}

export function moveBelowTodo(id, parentId) {
  return {
    type: TodoAction.MOVE_BELOW_TODO,
    id,
    parentId
  };
}

export function flipTodo(id) {
  return {
    type: TodoAction.FLIP_TODO,
    id
  };
}

export function removeTodo(id) {
  return {
    type: TodoAction.REMOVE_TODO,
    id
  };
}

export function makeChildOf(id, parentId) {
  return {
    type: TodoAction.MAKE_CHILD_OF_TODO,
    id,
    parentId
  };
}

export function selectTodo(id) {
  return {
    type: TodoAction.SELECT_TODO,
    id
  };
}
