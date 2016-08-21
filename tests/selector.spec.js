import 'should';
import { createSelector } from 'reselect';
import {filterr} from '../public/js/lib/collectionUtils.js';


describe('selector', function() {

  it('test selector', () => {
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
      selectTodos, selectFilterDone,
      (todos, filter) => {
        return filterr(todos, (i) => filterStrategy(i, filter));
      }
    );

    (selectFilteredTodos() === selectFilteredTodos()).should.equal(true);
  });

  it('test memoize', () => {
    let counter = 0;
    const todos = 'todos';

    const stateA = {todos, filter: 'A'};
    const stateB = {todos, filter: 'B'};

    const todosSelector = state => state.todos;
    const filterSelector = state => state.filter;

    const selectFilteredTodos = createSelector(
      todosSelector, filterSelector,
      (todos, filter) => {
        // console.log(todos, filter);
        counter++;
        return todos + filter;
      }
    );

    selectFilteredTodos(stateA).should.equal('todosA');
    selectFilteredTodos(stateA).should.equal('todosA');
    counter.should.equal(1);

    selectFilteredTodos(stateB).should.equal('todosB');
    selectFilteredTodos(stateB).should.equal('todosB');
    counter.should.equal(2);

    selectFilteredTodos(stateA).should.equal('todosA');
    counter.should.equal(3); // probably can be 2 if memoize will cache for longer (like 2, 3 last results)

  });

});
