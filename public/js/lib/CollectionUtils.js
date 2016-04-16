export function mapr(items, callback, childField = 'children') {
  function process(i) {
    const result = callback(i);
    if (childField != undefined && result != undefined && result[childField]) {
      result[childField] = result[childField].map(process);
    }
    return result;
  }
  return items.map(process);
}

export function callr(items, callback, childField = 'children') {
  function process(i) {
    callback(i);
    if (childField != undefined && i[childField]) {
      i[childField].map(process);
    }
  }
  return items.map(process);
}

export function searchr(items, check, childField = 'children') {
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

export function searchrIndex(items, check, childField = 'children') {
  let index = -1;
  if (
    searchr(items, (i) => {
      index++;
      return check(i);
    }) !== false
  ) {
    return index;
  } else {
    return -1;
  }
}

export function searchrByIndex(items, index, childField = 'children') {
  let idx = 0;
  return searchr(items, (i) => idx++ == index);
}

export function lengthr(items, childField = 'children') {
  let idx = 0;
  callr(items, () => idx++);
  return idx;
}
