import React from 'react';

import 'should';

import {getTodoLabel} from '../public/js/components/Items/Item.jsx';

describe('item test', function() {

  it('simple label', () => {
    const lbl = 'some text';
    getTodoLabel(lbl).should.equal(lbl);
  });

  it('label with context', () => {
    // console.log(s);
    // getTodoLabel(lbl).should.equal(lbl);
  });

});
