import * as types from '../constants/ActionTypes'

export function addTodo(text) {
  return {
    type: types.ADD_TODO,
    text
  }
}

export function checkTodo(id) {
  return {
    type: types.CHECK_TODO,
    id
  }
}

export function updateTodo(id, text) {
  return {
    type: types.UPDATE_TODO,
    id,
    text
  }
}

export function swapTodos(id1, id2) {
  return {
    type: types.SWAP_TODOS,
    id1,
    id2
  }
}
