import 'should';

import * as TodoActions from '../public/js/actions/todos.js';
import {todos} from '../public/js/reducers/todos.js';
import Todo from '../public/js/models/Todo';
import {lookup, lookupPrev, lookupNext} from '../public/js/components/Items/ItemsList.jsx';

describe('items list test', function() {

    const initialState = {
      todos: [
        new Todo(0, 'Learn React'),
        new Todo(1, 'Learn Redux', true, [
          new Todo(4, 'Read manual'),
          new Todo(5, 'Write the code')
        ]),
        new Todo(2, 'Learn HTML', true),
        new Todo(3, 'Learn CSS')
      ]
    };

    it('lookup', () => {
      const todoItems = initialState.todos;
      lookupPrev(todoItems, 1).id.should.equal(0);

      lookupNext(todoItems, 1).id.should.equal(2);

      lookupPrev(todoItems, 2).id.should.equal(1);

      const expanded = todos(initialState, TodoActions.flipTodo(1)).todos; // expand item
      expanded[1].open.should.equal(true);

      const res = lookupPrev(expanded, 2);
      res.id.should.equal(5);

      lookupPrev(expanded, 1).id.should.equal(0);

      lookupNext(expanded, 1).id.should.equal(4);

      lookupNext(expanded, 5).id.should.equal(2);

      lookupPrev(expanded, 4).id.should.equal(1);

      lookupPrev(expanded, 0).should.equal(false); // for first element

      lookupNext(expanded, 3).should.equal(false); // for last element
    });

});
