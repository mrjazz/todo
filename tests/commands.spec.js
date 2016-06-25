import 'should';

import {
  valueOfTypeByState,
  parseCommand,
  getParams,
  matchCommand,
  getHint,
  validateCommand
} from '../public/js/lib/commands.js';

import Todo from '../public/js/models/Todo';


const state = {
  focusId: null,
  lastFocusId: 0,
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

  // it('param with id', () => {
  //   const result = validateCommand('addB learn', state);
  //   console.log(result);
  //   const hint = getHint(result);
  //   console.log(hint);
  //   // hint.should.equal('<b>addBelow</b> [<b>id : Learn React</b>], [<i>todo : some text</i>]');
  // });

  it('param with id defined', () => {
    const result = validateCommand('addB "learn react"', state);
    const hint = getHint(result);
    hint.should.equal('<b>addBelow</b> [<b>id : Learn React</b>], [<i>todo : some text</i>]');
  });

  // it('one param', () => {
  //   const result = validateCommand('add something', state);
  //   const hint = getHint(result);
  //   hint.should.equal('<b>addTodo</b> [<i>text : <b>something</b></i>], addBelow [item] [todo], pasteAsChildTodo [item] [todo]');
  // });

  it('mutliple params highlight', () => {
    const result = validateCommand('add', state);
    const hint = getHint(result);
    hint.should.equal('<b>addTodo</b> [<i>text : some text</i>], addBelow [item] [todo], addAsChild [item] [text]');
  });

  // it('mutliple params test', () => {
  //   const result = validateCommand('addAsChild "learn react" "learn webpack"', state);
  //   result[0].signature.id.value.id.should.equal(0);
  //   result[0].signature.text.value.should.equal('learn webpack');
  //
  //   const hint = getHint(result);
  //   hint.should.equal('<b>addAsChild</b> [<i>id : <b>Learn React</b></i>], [<i>text : <b>learn webpack</b></i>]');
  // });

  it('mutliple params test 2', () => {
    const result = validateCommand('addAsChild', state);
    result[0].action.should.equal('addAsChild');

    const hint = getHint(result);
    hint.should.equal('<b>addAsChild</b> [<i>id : id of todo or selected id by default</i>], [<i>text : some text</i>]');
  });

  it('date type matching', () => {
    (valueOfTypeByState('tomorrow', 'date', state).value instanceof Date).should.true();
    (valueOfTypeByState('qwe', 'date', state).value == null).should.true();
  });

  it('filter type matching', () => {
    valueOfTypeByState('all', 'filter', state).value.should.equal('All');
    valueOfTypeByState('todo', 'filter', state).value.should.equal('Todo');

    (valueOfTypeByState('act', 'filter', state).value == null).should.true();
    valueOfTypeByState('act', 'filter', state).options.length.should.equal(1);
    valueOfTypeByState('act', 'filter', state).options[0].should.equal('Active');
  });

  it('id and parentId values matching', () => {
    const checkResult = (result) => {
      (result instanceof Todo).should.true();
      result.id.should.equal(0);
      result.text.should.equal('Learn React');
    };

    checkResult(valueOfTypeByState('learn react', 'id', state).value);
    checkResult(valueOfTypeByState('react', 'id', state).options[0]);
    checkResult(valueOfTypeByState('', 'id', state).options[0]);
  });

  it('suggestions1', () => {
    const result = validateCommand('aT', state);
    result[0].action.should.equal('addTodo');
  });

  it('suggestions2', () => {
    const result = validateCommand('aT some task', state);
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
