/**
 * Created by denis on 6/3/2016.
 */

const stateKey = 'state'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(stateKey);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
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
