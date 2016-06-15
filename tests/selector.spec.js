import 'should';
import { createSelector } from 'reselect';
import {filterr} from '../public/js/lib/collectionUtils.js';


const initialState = {
  focusId: null,
  lastInsertId: null,
  cancelId: null,
  clipboard: null,
  todos: [
    {id: 1, text: 'item1 #context and @contact', done: false},
    {id: 2, text: 'item2 @contact', done: false},
    {id: 3, text: 'item3 #context', done: true}
  ]
};

const selectTodos = () => initialState.todos;
const selectFilterDone = () => 'completed';
const filterStrategy = (item, filter) => {
  switch(filter) {
    case 'active':
      return !item.done;
    case 'completed':
      return item.done;
    default:
      return true;
  }
};

const selectFilteredTodos = createSelector(
  [selectTodos, selectFilterDone],
  (todos, filter) => {
    return filterr(todos, (i) => filterStrategy(i, filter));
  }
);

describe('selector', function() {

  it('test selector', () => {
    selectFilteredTodos().should.equal(selectFilteredTodos());
  });

});
