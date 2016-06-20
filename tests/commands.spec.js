import 'should';

import {parseCommand, getParams, matchCommand, validateCommand} from '../public/js/lib/commands.js';
import Todo from '../public/js/models/Todo';

const state = {
  focusId: null,
  lastFocusId: null,
  filter: null,
  lastInsertId: null,
  cancelId: null,
  clipboard: null,
  todos: [
    new Todo(0, 'Learn React'),
    new Todo(1, 'Learn Redux', true, [
      new Todo(4, 'Read manual'),
      new Todo(5, 'Write the code'),
    ]),
    new Todo(18, 'Send feature request @mrjazz #todo'),
    new Todo(19, 'Star repository #todo')
  ]
};

describe('commands test', function() {

  it('suggestions1', () => {
    const result = validateCommand('aT', state);
    result[0].action.should.equal('addTodo');
  });

  it('suggestions2', () => {
    const result = validateCommand('aT some task', state);
    // console.log(result);
    result[0].action.should.equal('addTodo');
  });

  it('suggestions3', () => {
    validateCommand().length.should.equal(0);
    validateCommand('').length.should.equal(0);
    validateCommand(' ').length.should.equal(0);

    const result = validateCommand('add', state);
    result.length.should.equal(3);
    result[0].action.should.equal('addTodo');
    result[1].action.should.equal('addBelow');
    result[2].action.should.equal('addAsChild');

    result[1].toString().should.equal('addBelow [item] [todo]');
  });

  it('checking strings', () => {
    matchCommand('addSomeThing', 'add some thing like test').relevance.should.equal(35);
    matchCommand('addSomeThing', 'addST').relevance.should.equal(18);
    matchCommand('addSomeThing', 'addst').relevance.should.equal(12);

    matchCommand('updateTodo', 'add').relevance.should.equal(-1);
    matchCommand('addSomeThing', 'addSTo').relevance.should.equal(-1);

    matchCommand('addSomeThing', 'addThing').relevance.should.equal(24);
    matchCommand('addSomeThing', 'addsomething').relevance.should.equal(35);
    matchCommand('addSomeThing', 'ADDSOMETHING').relevance.should.equal(41);
  });

  it('parse params', () => {
    getParams('get').should.equal('');
    getParams('get  ').should.equal('');
    getParams('get something').should.equal('something');
    getParams('get something new').should.equal('something new');
    getParams('get    something new  ').should.equal('something new');
  });

  it('parse command', () => {
    parseCommand('add');
  });


});
