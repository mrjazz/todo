import 'should';

import Todo from '../public/js/models/Todo';
import { transformTodos } from '../public/js/lib/todoTransformations.js';
import { mapr, lengthr } from '../public/js/lib/collectionUtils.js';


describe('todoList transformations', function() {

  const initialState = {
    todos : [
      new Todo(0, 'Learn React'),
      new Todo(1, 'Learn Redux #learning', false, [
        new Todo(4, 'Read manual #coding'),
        new Todo(5, 'Write the code', true)
      ])
    ]
  };

  function matchContext(s) {
    return s.match(/#(\S*)/g);
  }

  it('searchBy', () => {
    const result = transformTodos(initialState.todos, {searchBy : (i) => {
      const contexts = matchContext(i.text);
      return Array.isArray(contexts) && contexts.length > 0;
    }});

    // console.log(result);

    result.length.should.equal(2);
    result[0].text.should.equal('Learn Redux #learning');
    result[1].text.should.equal('Read manual #coding');
  });

  it('filterBy', () => {
    const result = transformTodos(initialState.todos, {
      filterBy : (i) => (!Array.isArray(i.children) || i.children.length == 0)
    });
    // console.log(result);
    result.length.should.equal(1);
    result[0].text.should.equal('Learn Redux #learning');
  });

  it('groupBy', () => {
    const result = transformTodos(initialState.todos, {'groupBy' : (i) => matchContext(i.text)});
    // console.log(result);
    result.length.should.equal(2); //['#coding'].length.should.equal(1);
    result[0].text.should.equal('#learning (3)');
    result[1].text.should.equal('#coding (1)');

    result[0].children.length.should.equal(3); // learning
    result[1].children.length.should.equal(1); // coding

    result[0].children[0].text.should.equal('Learn Redux #learning');
    result[0].children[1].text.should.equal('Read manual #coding');
    result[0].children[2].text.should.equal('Write the code');

    result[1].children[0].text.should.equal('Read manual #coding');
  });

  it('without groupBy', () => {
    const result = transformTodos(initialState.todos);

    result.length.should.equal(2);
    lengthr(result).should.equal(4);
  });

  it('groupBy & filterBy', () => {
    const result = transformTodos(
      initialState.todos,
      {
        'groupBy' : (i) => matchContext(i.text),
        'filterBy': (i) => i.done
      }
    );

    result.length.should.equal(2);
    result[0].text.should.equal('#learning (2)');
    result[1].text.should.equal('#coding (1)');

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
        'filterBy': (i) => i.done,
        'orderBy': (a, b) => a > b
      }
    );

    result.length.should.equal(2);
    result[0].text.should.equal('#coding (1)');
    result[1].text.should.equal('#learning (2)');

    mapr(result[0].children, (i) => i.done.should.equal(false));
    mapr(result[1].children, (i) => i.done.should.equal(false));
  });

});
