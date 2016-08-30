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

  let result = todos;
  const groups = {};

  if (condition && condition['searchBy']) {
    result = searchr(result, condition['searchBy']);
  }  

  function orderBy(i) {
    if (condition && condition['orderBy'] && i['children'] && i['children'].length > 0) {
      i.children.sort(condition['orderBy']);
    }
    return i;
  }

  function filterBy(todos) {    
    if (condition && condition['filterBy']) {      
      return filterr(todos, (i) => condition['filterBy'](i));
    } else {
      return todos;
    }
  }

  function groupBy(arr, matcher) {
    for (let i in arr) {
      const value = arr[i];

      // filter condition apply
      // if (condition && condition['filterBy'] && condition['filterBy'](value)) continue;

      const matchedGroups = matcher(value);            

      if (Array.isArray(matchedGroups)) {
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
    groupBy(result, condition['groupBy']);    
    result = []

    let groupId = -1;
    for (let j in groups) {
      // flat groups and apply filter condition if exists
      let children = filterBy(flatr(groups[j]));
      result.push(new TreeNode(groupId--, `${j} (${lengthr(children)})`, children));
    }
  } else {
    result = filterBy(result);
  }
  
  if (condition && condition['orderBy']) {
    result = mapr(result, (i) => orderBy(i));
  }


  return result;
}
