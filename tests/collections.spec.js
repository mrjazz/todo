import 'should';

import {mapr, callr, filterr, searchr, searchrIndex, searchrByIndex, lengthr} from '../public/js/lib/CollectionUtils.js';

describe('collections test', function() {

    const arr = [
      {label: 'a', children: [
        {label: 'a1'},
        {label: 'a2'}
      ]},
      {label: 'b'}
    ];

    it('callr', () => {
      const result = [];
      callr(arr, function (i) { result.push(i.label); }, 'children');
      result.length.should.equal(4);
    });

    it('mapr', () => {
      const result = mapr(arr, function (o) {
        return o.label == 'a2' ?
            Object.assign({}, o, { test: 'passed' }) : o;
      });

      result[0].label.should.equal('a');
      result[1].label.should.equal('b');
      result[0].children[1].label.should.equal('a2');

    });

    it('filterr', () => {
      const result = filterr(arr, function (o) {
        return o.label != 'a2';
      });

      result[0].children.length.should.equal(1);
    });

    it('searchr', () => {
      searchr(arr, function (i) { return i.label == 'a2'; }, 'children').label.should.equal('a2');
    });

    it('searchrIndex', () => {
      searchrIndex(arr, function (i) { return i.label == 'a2'; }, 'children').should.equal(2);
      searchrIndex(arr, function (i) { return i.label == 'a'; }, 'children').should.equal(0);
    });

    it('searchrByIndex', () => {
      //searchrIndex(arr, function (i) { return i.label == 'a2'}, 'children').should.equal(2);
      searchrByIndex(arr, 0, 'children').label.should.equal('a');
      searchrByIndex(arr, 2, 'children').label.should.equal('a2');
    });

    it('lengthr', () => {
      lengthr(arr, 'children').should.equal(4);
    });

});
