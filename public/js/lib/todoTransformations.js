import {mapr, flatr, filterr} from './collectionUtils.js';
import TreeNode from '../models/TreeNode.js';


/**
 *
 * @param todos
 * @param condition {groupBy : Function, filterBy : Function, orderBy : Function}
 * @returns {{}}
 */
export function transformTodos(todos, condition) {

  let result = [];
  const groups = {};

  function filterBy(i) {
    return condition && condition['filterBy'] ? condition['filterBy'](i) : true;
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
      if (condition && condition['filterBy'] && !condition['filterBy'](value)) continue;

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
      result.push(new TreeNode(groupId--, j, children));
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
