import * as TodoAction from '../constants/TodoActionTypes';

export function updateTodo(id, text) {
  return {
    type: TodoAction.UPDATE_TODO,
    id,
    text
  };
}

export function deleteTodo(id) {
  return {
    type: TodoAction.DELETE_TODO,
    id
  };
}

export function deleteAll() {
  return {
    type: TodoAction.DELETE_ALL
  };
}

export function copyTodo(id) {
  return {
    type: TodoAction.COPY_TODO,
    id
  };
}

export function cutTodo(id) {
  return {
    type: TodoAction.CUT_TODO,
    id
  };
}

export function pasteTodo(id) {
  return { type: TodoAction.PASTE_TODO, id };
}

export function pasteAsChildTodo(parentId) {
  return { type: TodoAction.PASTE_AS_CHILD_TODO, parentId };
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

export function updateFilter(filter) {
  return {
    type: TodoAction.UPDATE_FILTER,
    filter
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

export function selectLastTodo() {
  return { type: TodoAction.SELECT_LAST_TODO };
}

export function updateDateStart(id, date) {
  return {
    type: TodoAction.UPDATE_DATE_START,
    id,
    date
  };
}

export function updateDateEnd(id, date) {
  return {
    type: TodoAction.UPDATE_DATE_END,
    id,
    date
  };
}

export function updateNote(id, note) {
  return {
    type: TodoAction.UPDATE_NOTE,
    id,
    note
  };
}

export function previewNote(id) {
  return {
    type: TodoAction.PREVIEW_NOTE,
    id
  };
}

export function importFromUrl(url) {
  return {
    type: TodoAction.IMPORT_FROM_URL,
    url
  };
}
