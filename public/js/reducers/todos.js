import Todo from '../models/Todo';
import {callr, findr, mapr, filterr, insertrAfter, insertrBefore} from '../lib/collectionUtils.js';
import {importByUrl} from '../api/backend';


const initialState = {
  focusId: null,
  lastFocusId: null,
  filter: null,
  lastInsertId: null,
  cancelId: null,
  clipboard: null,
  todos: [
    new Todo(0, 'Learn React'),
    new Todo(1, 'Learn Redux', true, [
      new Todo(4, 'Read manual'),
      new Todo(5, 'Write the code'),
    ]),
    new Todo(18, 'Send feature request @mrjazz #todo'),
    new Todo(19, 'Star repository #todo')
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

    DELETE_ALL() {
      state = initialState;
    },

    UPDATE_FILTER() {
      state.filter = action.filter;
    },

    SELECT_TODO() {
      if (action.id == null) {
        state.lastFocusId = state.focusId;
      } else {
        state.lastFocusId = null;
      }
      state.focusId = action.id;
    },

    SELECT_LAST_TODO() {
      state.focusId = state.lastFocusId;
    },

    PASTE_AS_CHILD_TODO() {
      if (state.clipboard != null) {
        const todo = Object.assign(clone(state.clipboard), { id: newId() });

        state.todos = mapr(state.todos, (i) => {
          if (i.id === action.parentId) {
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
      // state.clipboard = findr(state.todos, (i) => action.id === i.id);
      if (state.clipboard != null) {
        const todo = Object.assign(clone(state.clipboard), { id: newId() });

        console.log(action.id);
        console.log(todo);

        state.todos = insertrAfter(state.todos, todo, (i) => i.id == action.id);
        state.clipboard = null;
        state.focusId = state.lastInsertId;
      }
    },

    COPY_TODO() {
      state.clipboard = findr(state.todos, (i) => action.id === i.id);
    },

    CUT_TODO() {
      state.clipboard = findr(state.todos, (i) => action.id === i.id);
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
        if (findr(state.todos[i].children, (todo) => todo.id === state.focusId)) {
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

    IMPORT_FROM_URL() {
      console.log('import');

      let id = 1;
      importByUrl(action.url).then(function (res) {
        const items = mapr(res.items, (item) => new Todo(id++, item.title), 'items');

        state.focusId = null;
        state.lastFocusId = null;
        state.filter = null;
        state.lastInsertId = null;
        state.cancelId = null;
        state.todos = fromJsonInTodo(res.items);
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
        new Todo(state.focusId, action.text),
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

    UPDATE_DATE_START() {
      state.todos = mapr(state.todos, todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { dateStart: action.date }) :
          todo
      );
    },

    UPDATE_DATE_END() {
      state.todos = mapr(state.todos, todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { dateEnd: action.date }) :
          todo
      );
    },

    UPDATE_NOTE() {
      state.todos = mapr(state.todos, todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { note: action.note }) :
          todo
      );
    },

    PREVIEW_NOTE() {
      state.todos = mapr(state.todos, todo =>
        todo.id === action.id ?
          Object.assign(Object.create(todo), todo, { previewNote: !todo.previewNote }) :
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


export function fromJsonInTodo(json) {
  let id = 1;

  const processAll = (items) => items.map((item) => new Todo(
    id++,
    item.title,
    false,
    item.items && item.items.length > 0 ? processAll(item.items) : []
  ));

  return processAll(json);
}
