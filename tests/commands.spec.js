import 'should';

import {checkString, validateCommand} from '../public/js/lib/commands.js';

describe('commands test', function() {

  it('suggestions', () => {
    validateCommand('').length.should.equal(0);
    validateCommand(' ').length.should.equal(0);
    
    const result = validateCommand('add');
    result[0].should.equal('addTodo');
    result[1].should.equal('addBelow');
    result[2].should.equal('addAsChild');
  });

  it('checking strings', () => {
    checkString('addSomeThing', 'addsomething').should.equal(true);
    checkString('addSomeThing', 'ADDSOMETHING').should.equal(true);
    checkString('addSomeThing', 'add_some_thing').should.equal(true);
    checkString('addSomeThing', 'add-some-thing').should.equal(true);
    checkString('addSomeThing', 'add-some-thing').should.equal(true);
    checkString('addSomeThing', 'Add-Some-Thing').should.equal(true);
  });

});
