import 'should';

import Todo from '../public/js/models/Todo';
import { transformTodos } from '../public/js/lib/todoTransformations.js';
import { lengthr } from '../public/js/lib/collectionUtils.js';


describe('todoList transformations', function() {

  const initialState = {
    todos : [
      new Todo(0, 'Learn React'),
      new Todo(1, 'Learn Redux #learning', false, [
        new Todo(4, 'Read manual #coding'),
        new Todo(5, 'Write the code', true)
      ]),
      // new Todo(2, 'Learn HTML #coding #learning', true),
      // new Todo(3, 'Learn CSS')
    ]
  };

  function matchContext(s) {
    return s.match(/#(\S*)/g);
  }

  it('groupBy', () => {
    const result = transformTodos(initialState.todos, {'groupBy' : (i) => matchContext(i.text)});
    // console.log(result);
    result.length.should.equal(2); //['#coding'].length.should.equal(1);
    result[0].text.should.equal('#learning');
    result[1].text.should.equal('#coding');

    result[0].children.length.should.equal(3); // learning
    result[1].children.length.should.equal(1); // coding

    result[0].children[0].text.should.equal('Learn Redux #learning');
    result[0].children[1].text.should.equal('Read manual #coding');
    result[0].children[2].text.should.equal('Write the code');

    result[1].children[0].text.should.equal('Read manual #coding');
  });

  it('without groupBy', () => {
    const result = transformTodos(initialState.todos);
    // console.log(result);
    result.length.should.equal(2);
    lengthr(result).should.equal(4);
  });

  it('groupBy & filterBy', () => {
    const result = transformTodos(
      initialState.todos,
      {
        'groupBy' : (i) => matchContext(i.text),
        'filterBy': (i) => !i.done
      }
    );

    // console.log(result);
    result.length.should.equal(2);
    result[0].text.should.equal('#learning');
    result[1].text.should.equal('#coding');

    result[0].children.length.should.equal(2);
    result[1].children.length.should.equal(1);

    result[0].children[0].text.should.equal('Learn Redux #learning');
    result[0].children[1].text.should.equal('Read manual #coding');
  });

  it('groupBy & filterBy & orderBy', () => {
    const result = transformTodos(
      initialState.todos,
      {
        'groupBy' : (i) => matchContext(i.text),
        'filterBy': (i) => !i.done,
        'orderBy': (a, b) => a > b
      }
    );

    // console.log(result[1]);

    result.length.should.equal(2);
    result[0].text.should.equal('#coding');
    result[1].text.should.equal('#learning');

    result[0].children.length.should.equal(1);
    result[1].children.length.should.equal(2);

    result[1].children[0].text.should.equal('Learn Redux #learning');
    result[1].children[1].text.should.equal('Read manual #coding');

  });

});
