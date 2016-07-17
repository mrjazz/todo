import 'should';

import * as TodoActions from '../public/js/actions/todos.js';
import {todos, fromJsonInTodo} from '../public/js/reducers/todos.js';
import Todo from '../public/js/models/Todo';

describe('collections test', function() {

    const initialState = {
      todos : [
        new Todo(0, 'Learn React'),
        new Todo(1, 'Learn Redux', true, [
          new Todo(4, 'Read manual'),
          new Todo(5, 'Write the code')
        ]),
        new Todo(2, 'Learn HTML', true),
        new Todo(3, 'Learn CSS')
      ]
    };

    it('fromJsonInTodo', () => {
      const json = [
        {'title' : 'item1.1', 'items' : [
          {'title' : 'item2.1', 'items' : [
            {'title' : 'item3.1', 'items' : []},
            {'title' : 'item3.2', 'items' : []}
          ]}
        ]},
        {'title' : 'item1.2', 'items' : []}
      ];

      const result = fromJsonInTodo(json);
      result[0].id.should.equal(1);
      result[0].text.should.equal('item1.1');

      result[0].children[0].id.should.equal(2);
      result[0].children[0].text.should.equal('item2.1');

      result[0].children[0].children[0].id.should.equal(3);
      result[0].children[0].children[0].text.should.equal('item3.1');

      result[0].children[0].children[1].id.should.equal(4);
      result[0].children[0].children[1].text.should.equal('item3.2');
    });

    it('expandAndCollapse', () => {
      const result1 = todos(initialState, TodoActions.expandAll());
      result1.todos[1].open.should.equal(true);
      result1.focusId = 5;
      const result2 = todos(result1, TodoActions.collapseAll());
      result2.todos[1].open.should.equal(false);
      result2.focusId.should.equal(1);
    });

    it('addBelow', () => {
      const title = 'Test';
      const result1 = todos(initialState, TodoActions.addBelow(1, title));

      result1.todos[2].text.should.equal(title);

      const result2 = todos(initialState, TodoActions.addBelow(5, title));
      result2.todos[1].children[2].text.should.equal(title);

      const result3 = todos({
          todos: [new Todo(100, 'Learn React')]
        },
        TodoActions.addBelow(100, title)
      );
      result3.todos[1].id.should.equal(101); // make sure next id is bigger than all previous
    });

    it('addAsChild', () => {
      const title = 'Test';
      const result1 = todos(initialState, TodoActions.addAsChild(1, title));
      result1.todos[1].children[2].text.should.equal(title);
    });

    it('deleteTodo', () => {
      const result = todos(initialState, TodoActions.deleteTodo(1));
      result.todos.length.should.equal(3);
      result.todos[1].id.should.equal(2);
    });

    it('check', () => {
      initialState.todos[1].children[0].done.should.equal(false);
      const result = todos(initialState, TodoActions.checkTodo(4));
      result.todos[1].children[0].done.should.equal(true);
    });

    it('remove', () => {
      const result = todos(initialState, TodoActions.deleteTodo(0));
      result.todos.length.should.equal(3);
    });

    it('makeChildOf', () => {
      const result = todos(initialState, TodoActions.makeChildOf(4, 2));

      result.todos[1].children.length.should.equal(1);
      result.todos[2].children.length.should.equal(1);
      result.todos[2].children[0].id.should.equal(4);
    });

    it('moveAboveTodo', () => {
      // the same level case
      const result1 = todos(initialState, TodoActions.moveAboveTodo(0, 3));
      result1.todos[0].id.should.equal(1);
      result1.todos[2].id.should.equal(0);
      result1.todos[3].id.should.equal(3);

      // different level cases level case
      const result2 = todos(initialState, TodoActions.moveAboveTodo(2, 5));
      result2.todos[1].children[1].id.should.equal(2);
      result2.todos[1].children[2].id.should.equal(5);
    });

    it('moveBelowTodo', () => {
      // the same level case
      const result1 = todos(initialState, TodoActions.moveBelowTodo(0, 3));
      result1.todos[0].id.should.equal(1);
      result1.todos[2].id.should.equal(3);
      result1.todos[3].id.should.equal(0);

      // different level cases level case
      const result2 = todos(initialState, TodoActions.moveBelowTodo(2, 5));
      result2.todos[1].children[1].id.should.equal(5);
      result2.todos[1].children[2].id.should.equal(2);
    });

    it('flipTodo', () => {
      initialState.todos[1].open.should.equal(false); // check initial state

      const result1 = todos(initialState, TodoActions.flipTodo(1));
      result1.todos[1].open.should.equal(true); // first flip (expand)

      const result2 = todos(result1, TodoActions.flipTodo(1));
      result2.todos[1].open.should.equal(false); // second flip (collapse)
    });

});
