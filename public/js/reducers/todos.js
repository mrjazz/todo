import * as TodoAction from '../constants/TodoActionTypes';
import Todo from '../models/todo';
import {callr, searchr, mapr, filterr, insertrAfter, insertrBefore} from '../lib/CollectionUtils.js';


const initialState = {
  focusId: null,
  lastInsertId: null,
  cancelId: null,
  clipboard: null,
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


// Utilites ////////////////////////////////////////////////////////////////////////////

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

// Process //////////////////////////////////////////////////////////////////////////

export function todos(state = initialState, action) {

  function newId() {
    let max = 0;
    callr(state.todos, (i) => max = i.id > max ? i.id : max);
    state.lastInsertId = max + 1;
    return state.lastInsertId;
  }

  const todoActions = {
    SELECT_TODO() {
      state.focusId = action.id;
    },

    PASTE_AS_CHILD_TODO() {
      if (state.clipboard != null) {
        const todo = Object.assign(clone(action.todo), { id: newId() });

        state.todos = mapr(state.todos, (i) => {
          if (i.id === action.id) {
            i.open = true;
            i.children = [
              ...i.children,
              todo
            ];
          }
          return i;
        });

        state.clipboard = null;
        state.focusId = state.lastInsertId;
      }
    },

    PASTE_TODO() {
      // state.clipboard = searchr(state.todos, (i) => action.id === i.id);
      if (state.clipboard != null) {
        console.log(action.todo);
        const todo = Object.assign(clone(action.todo), { id: newId() });
        state.todos = insertrAfter(state.todos, todo, (i) => i.id == action.id);
        state.clipboard = null;
        state.focusId = state.lastInsertId;
      }
    },

    COPY_TODO() {
      state.clipboard = searchr(state.todos, (i) => action.id === i.id);
    },

    CUT_TODO() {
      state.clipboard = searchr(state.todos, (i) => action.id === i.id);
      state.todos = filterr(state.todos, (i) => i.id !== action.id);
    },

    COLLAPSE_ALL() {
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
    },

    EXPAND_ALL() {
      state.todos = mapr(state.todos, (todo) => {
        return todo.children.length > 0 ?
          Object.assign(clone(todo), { open: true }) :
          todo;
      });
    },

    ADD_AS_CHILD() {
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
    },

    ADD_TODO() {
      const id = newId();
      state.todos = [
        ...state.todos,
        new Todo(id, action.text, false)
      ];
    },

    ADD_BELOW() {
      // console.log(action.todo);
      state.cancelId = state.focusId;
      state.focusId = newId();
      state.todos = insertrAfter(
        state.todos,
        Object.assign(clone(action.todo), { id: state.focusId }),
        (i) => i.id == action.id
      );
    },

    CANCEL_CREATE() {
      state.todos = filterr(state.todos, (i) => i.id !== state.lastInsertId);
      state.focusId = state.cancelId;
      state.cancelId = null;
    },

    CHECK_TODO() {
      state.todos = mapr(state.todos, (todo) => {
        return todo.id === action.id ?
          Object.assign(clone(todo), { done: !todo.done }) :
          todo;
      });
    },

    UPDATE_TODO() {
      state.focusId = action.id;
      state.cancelId = null;
      state.todos = mapr(state.todos, todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { text: action.text }) :
          todo
      );
    },

    MOVE_ABOVE_TODO() {
      state.todos = insert(insertrBefore, state.todos, action.id, action.parentId);
    },

    MOVE_BELOW_TODO() {
      state.todos = insert(insertrAfter, state.todos, action.id, action.parentId);
    },

    DELETE_TODO() {
      state.todos = filterr(state.todos, (i) => i.id !== action.id);
    },

    MAKE_CHILD_OF_TODO() {
      let item = false;
      const filtered = filterr(state.todos, (todo) => {
        if (todo.id === action.id) {
          item = clone(todo);
          return false;
        } else {
          return true;
        }
      });

      state.todos = mapr(filtered, (todo) => {
        if (item && todo.id === action.parentId) {
          todo.add(item);
        }
        return todo;
      });
    },

    REMOVE_TODO() {
      state.todos = filterr(state.todos, (todo) => {
        return todo.id !== action.id;
      });
    },

    FLIP_TODO() {
      state.todos = mapr(state.todos, (todo) => {
        return todo.id === action.id ? Object.assign(Object.create(todo), todo, {open: !todo.open}) : todo;
      });
    }
  };

  // console.info(action);

  state = clone(state);

  if (todoActions[action.type]) {
    todoActions[action.type](); // modify state
  }

  return state;
}
