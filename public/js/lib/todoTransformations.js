import {lengthr, mapr, searchr, flatr, filterr} from './collectionUtils.js';
import TreeNode from '../models/TreeNode.js';


/**
 * searchBy is function that prepare data before other operations
 * filterBy is function that return False for items we remove (something like having in SQL)
 *
 * @param todos
 * @param condition {groupBy : Function, filterBy : Function, orderBy : Function, searchBy : Function}
 * @returns {{}}
 */
export function transformTodos(todos, condition) {

  let result = [];
  const groups = {};

  if (condition && condition['searchBy']) {
    todos = searchr(todos, condition['searchBy']);
  }

  function filterBy(i) {
    return condition && condition['filterBy'] ? !condition['filterBy'](i) : true;
  }

  function orderBy(i) {
    if (condition && condition['orderBy'] && i['children'] && i['children'].length > 0) {
      i.children.sort(condition['orderBy']);
    }
    return i;
  }

  function groupBy(arr, matcher) {
    for (let i in arr) {
      const value = arr[i];

      // filter condition apply
      if (condition && condition['filterBy'] && condition['filterBy'](value)) continue;

      const matchedGroups = matcher(value);

      if (matchedGroups) {
        matchedGroups.map((j) => {
          if (!groups[j]) groups[j] = [];
          groups[j].push(value);
        });
      }

      if (value.children) {
        groupBy(value.children, matcher);
      }
    }
  }

  if (condition && condition['groupBy']) {
    groupBy(todos, condition['groupBy']);

    let groupId = -1;
    for (let j in groups) {
      // flat groups and apply filter condition if exists
      let children = flatr(groups[j]).filter((i) => filterBy(i));
      result.push(new TreeNode(groupId--, `${j} (${lengthr(children)})`, children));
    }

    if (condition && condition['orderBy']) {
      result.sort(condition['orderBy']);
    }

  } else {
    // just apply filterBy condition if exists
    result = filterr(todos, (i) => filterBy(i));
  }

  if (condition && condition['orderBy']) {
    result = mapr(result, (i) => orderBy(i));
  }

  return result;
}
