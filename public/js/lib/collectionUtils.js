/**
 * Map for tree structure
 * @param items
 * @param callback
 * @param childField
 * @returns {Array|*}
 */
export function mapr(items, callback, childField = 'children') {
  function process(i) {
    const result = callback(clone(i));
    if (childField !== undefined && result !== undefined && result[childField]) {
      result[childField] = result[childField].map(process);
    }
    return result;
  }
  return items.map(process);
}

/**
 * Return flat array from tree hierarchy
 *
 * @param items
 * @param childField
 * @returns {Array}
 */
export function flatr(items, childField = 'children') {
  const result = [];

  mapr(items, (i) => {
      result.push(i);
      return i;
    }, childField
  );

  // reset all children fore result
  return result.map((i) => {
    i[childField] = [];
    return i;
  });
}

/**
 * Filter tree by condition
 * @param items
 * @param condition
 * @param childField
 * @returns {*}
 */
export function filterr(items, condition, childField = 'children') {
  function process(result, i) {
    i = clone(i); // clone

    if (!condition(i)) return result;

    if (childField !== undefined && i[childField]) {
      i[childField] = i[childField].reduce(process, []);
    }

    result.push(i);
    return result;
  }
  return items.reduce(process, []);
}

/**
 * Recursive call functiona for elements of tree
 * @param items
 * @param callback
 * @param childField
 * @returns {Array|*}
 */
export function callr(items, callback, childField = 'children') {
  function process(i) {
    callback(i);
    if (childField !== undefined && i[childField]) {
      i[childField].map(process);
    }
  }
  return items.map(process);
  // TODO : Figure out why this shorter version doesn't work
  // return mapr(items, (i) => {
  //   callback(i);
  //   return true;
  // }, childField);
}

/**
 * Search all elements found by condition in tree
 *
 * @param items
 * @param check
 * @param childField
 * @returns {*}
 */
export function searchr(items, check, childField = 'children') {
  const result = [];
  function process (arr) {
    for (let i in arr) {
      const value = arr[i];
      if (check(value)) result.push(value);
      if (value[childField]) {
        process(value[childField]);
      }
    }
    return result;
  }
  return process(items);
}

/**
 * Search first element found by condition in tree
 * @param items
 * @param check
 * @param childField
 * @returns {*}
 */
export function findr(items, check, childField = 'children') {
  function process (arr) {
    for (let i in arr) {
      const value = arr[i];
      if (check(value)) return value;
      if (value[childField]) {
        const found = process(value[childField]);
        if (found) return found;
      }
    }
    return false;
  }
  return process(items);
}

/**
 * Search index by condition in tree
 * @param items
 * @param check
 * @param childField
 * @returns {number}
 */
export function findrIndex(items, check, childField = 'children') {
  let index = -1;
  if (
    findr(items, (i) => {
      index++;
      return check(i);
    }, childField) !== false
  ) {
    return index;
  } else {
    return -1;
  }
}

/**
 * Search by index in tree
 * @param items
 * @param index
 * @param childField
 */
export function findrByIndex(items, index, childField = 'children') {
  let idx = 0;
  return findr(items, () => idx++ == index, childField);
}

/**
 * Amount of all elements in the tree
 * @param items
 * @param childField
 * @returns {number}
 */
export function lengthr(items, childField = 'children') {
  let idx = 0;
  callr(items, () => idx++, childField);
  return idx;
}

/**
 * Insert element in recursive collection
 * @param items Array
 * @param item Object
 * @param condition function(currentItem)
 */
export function insertrBefore(items, item, condition, childField = 'children') {
  return insertr(items, item, condition, childField, true);
}

/**
 * Insert element in recursive collection
 * @param items Array
 * @param item Object
 * @param condition function(currentItem)
 */
export function insertrAfter(items, item, condition, childField = 'children') {
  return insertr(items, item, condition, childField, false);
}

export function getParentFor(items, condition, childField = 'children') {
  function process(items, parent) {
    for (let idx in items) {
      const i = items[idx];
      if (condition(i)) {
        return parent;
      }
      if (i[childField]) {
        const result = process(i[childField], i);
        if (result) {
          return result;
        }
      }
    }
    return false;
  }
  return process(items, false);
}

export function isParentOf(items, conditionParent, conditionItem, childField = 'children') {
  const parent = findr(items, conditionParent, childField);
  if (parent && parent[childField]) {
    return findr(parent[childField], conditionItem, childField) !== false;
  }
  return false;
}

// private functions

function insertr(items, item, condition, childField = 'children', before = true) {
  function process(items) {
    const result = [];
    items.forEach((i) => {
      const o = clone(i);
      if (before && condition(o)) result.push(item);
      if (childField !== undefined && i[childField]) {
        o[childField] = process(o[childField]);
      }
      result.push(o);
      if (!before && condition(o)) result.push(item);
    });
    return result;
  }
  return process(items);
}

function clone(o) {
  return Object.assign(Object.create(o), o); // clone
}
