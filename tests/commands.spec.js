import 'should';

import {getParams, checkString, validateCommand} from '../public/js/lib/commands.js';

describe('commands test', function() {

  it('suggestions', () => {
    validateCommand().length.should.equal(0);
    validateCommand('').length.should.equal(0);
    validateCommand(' ').length.should.equal(0);

    const result = validateCommand('add');
    result[0].action.should.equal('addTodo');
    result[1].action.should.equal('addBelow');
    result[2].action.should.equal('addAsChild');

    result[1].toString().should.equal('addBelow [todo]');
  });

  it('checking strings', () => {
    checkString('addSomeThing', 'addsomething').should.equal(true);
    checkString('addSomeThing', 'ADDSOMETHING').should.equal(true);
  });

  it('parse params', () => {
    getParams('get').should.equal('');
    getParams('get  ').should.equal('');
    getParams('get something').should.equal('something');
    getParams('get something new').should.equal('something new');
    getParams('get    something new  ').should.equal('something new');
  });



});
