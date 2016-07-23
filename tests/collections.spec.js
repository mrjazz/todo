import 'should';

import {
  mapr,
  flatr,
  callr,
  filterr,
  searchr,
  findr,
  findrIndex,
  findrByIndex,
  lengthr,
  isParentOf,
  insertrAfter,
  insertrBefore,
  getParentFor
} from '../public/js/lib/collectionUtils.js';


describe('collections test', function() {

  const arr = [
    {label: 'a', children: [
      {label: 'a1'},
      {label: 'a2'}
    ]},
    {label: 'b'}
  ];

  it('insertrBefore', () => {
    const result1 = insertrBefore(
      arr, {test: 'passed'}, (current) => current.label == 'b'
    );
    result1.length.should.equal(3);
    result1[1].test.should.equal('passed');

    const result2 = insertrBefore(
      arr, {test: 'passed'}, (current) => current.label == 'a2'
    );
    result2[0].children.length.should.equal(3);
    result2[0].children[1].test.should.equal('passed');
  });

  it('insertrAfter', () => {
    const result1 = insertrAfter(arr, {test: 'passed'}, (current) => current.label == 'b');
    result1.length.should.equal(3);
    result1[2].test.should.equal('passed');

    const result2 = insertrAfter(arr, {test: 'passed'}, (current) => current.label == 'a2');
    result2[0].children.length.should.equal(3);
    result2[0].children[2].test.should.equal('passed');
  });

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

  it('findr', () => {
    findr(arr, (i) => i.label == 'a2', 'children').label.should.equal('a2');
  });

  it('findrIndex', () => {
    findrIndex(arr, (i) => i.label == 'a2', 'children').should.equal(2);
    findrIndex(arr, (i) => i.label == 'a', 'children').should.equal(0);
  });

  it('findrByIndex', () => {
    //findrIndex(arr, function (i) { return i.label == 'a2'}, 'children').should.equal(2);
    findrByIndex(arr, 0, 'children').label.should.equal('a');
    findrByIndex(arr, 2, 'children').label.should.equal('a2');
  });

  it('lengthr', () => {
    lengthr(arr, 'children').should.equal(4);
  });

  it('isParentOf', () => {
    isParentOf(arr, (i) => i.label == 'a', (i) => i.label == 'a1').should.equal(true);
    isParentOf(arr, (i) => i.label == 'a1', (i) => i.label == 'a2').should.equal(false);

    isParentOf(arr, (i) => i.label == 'a2', (i) => i.label == 'a1').should.equal(false);
    isParentOf(arr, (i) => i.label == 'a2', (i) => i.label == 'a').should.equal(false);
  });

  it('getParentFor', () => {
    getParentFor(arr, (i) => i.label == 'a1').label.should.equal('a');
    getParentFor(arr, (i) => i.label == 'a2').label.should.equal('a');
    getParentFor(arr, (i) => i.label == 'a').should.equal(false);
  });

  it('searchr', () => {
    const result = searchr(arr, (o) => true);
    result.length.should.equal(4);
  });

  it('filtering in deep', () => {
    const result = searchr(arr, (o)  => !o.children);
    result.length.should.equal(3);
  });

  it('flatr', () => {
    const result = flatr(arr);
    result.length.should.equal(4);
    result[0].label.should.equal('a');
    result[1].label.should.equal('a1');
    result[2].label.should.equal('a2');
    result[3].label.should.equal('b');
  });

});
