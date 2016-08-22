import todoUnserialize from '../lib/fromJsonInTodo.js';

const stateKey = 'state';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(stateKey);
    if (serializedState === null) {
      return undefined;
    }
    const json = JSON.parse(serializedState);

    // unserialize todos from json
    json.todos.todos = todoUnserialize(json.todos.todos);

    return json;
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateKey, serializedState);
  } catch (err) {
    // do nothing
  }
};
