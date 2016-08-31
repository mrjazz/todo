import 'should';

import Todo from '../public/js/models/Todo';
import { transformTodos } from '../public/js/lib/todoTransformations.js';
import { filterr, mapr, lengthr } from '../public/js/lib/collectionUtils.js';
import fromJsonInTodo from '../public/js/lib/fromJsonInTodo.js';

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

  it('filterr side-effects', () => {
    const items = {
      todos : [
        new Todo(0, 'Learn React'),
        new Todo(1, 'Learn Redux #learning', false, [
          new Todo(4, 'Read manual #coding'),
          new Todo(5, 'Write the code', true)
        ])
      ]
    };
    const result = filterr(items.todos, (i) => (!Array.isArray(i.children) || i.children.length > 0)); 
    items.todos[1].children.length.should.equal(2);
    items.todos[1].children[0].text.should.equal('Read manual #coding');
    items.todos[1].children[1].text.should.equal('Write the code');
  });

  it('searchBy', () => {
    const result = transformTodos(initialState.todos, {searchBy : (i) => {
      const contexts = matchContext(i.text);
      return Array.isArray(contexts) && contexts.length > 0;      
    }});        
  
    result.length.should.equal(2);
    result[0].text.should.equal('Learn Redux #learning');
    result[1].text.should.equal('Read manual #coding');
  });
  
  it('filterBy', () => {
    const result = transformTodos(initialState.todos, {
      filterBy : (i) => (!Array.isArray(i.children) || i.children.length > 0)
    });    

    result.length.should.equal(1);
    result[0].text.should.equal('Learn Redux #learning');
  });
  
  it('groupBy', () => {      
    const result = transformTodos(
      initialState.todos,
      {'groupBy' : (i) => matchContext(i.text)}
    );
    
    result.length.should.equal(2); //['#coding'].length.should.equal(1);
    result[0].text.should.equal('#learning (1)');
    result[1].text.should.equal('#coding (0)');
  
    result[0].children.length.should.equal(1); // learning
    result[1].children.length.should.equal(0); // coding
    
    result[0].children[0].text.should.equal('Write the code');
  });
  
  it('without groupBy', () => {
    const result = transformTodos(initialState.todos);
    result.length.should.equal(2); // records are the same
  });
  
  it('groupBy & filterBy', () => {
    const result = transformTodos(
      [
        new Todo(0, 'Learn React'),
        new Todo(1, 'Learn Redux #learning', false, [
          new Todo(4, 'Read manual #coding'),
          new Todo(5, 'Write the code')
        ])
      ],
      {
        'groupBy' : (i) => matchContext(i.text),
        'filterBy': (i) => !i.done
      }
    );

    result.length.should.equal(2);
    result[0].text.should.equal('#learning (1)');
    result[1].text.should.equal('#coding (0)');
    
  });

  it('groupBy & filterBy & orderBy', () => {
    const result = transformTodos(
      [
        new Todo(0, 'Learn React'),
        new Todo(1, 'Learn Redux #learning', false, [
          new Todo(4, 'Read manual #coding', true),
          new Todo(5, 'Write the code', false),
          new Todo(6, 'Analyse the code', false),
          new Todo(7, 'Something else...', true)
        ])
      ],
      {
        'groupBy' : (i) => matchContext(i.text),
        'filterBy': (i) => !i.done && matchContext(i.text) == null,
        'orderBy' : (a, b) => a > b
      }
    );

    result.length.should.equal(2);
    result[0].text.should.equal('#learning (2)');
    result[1].text.should.equal('#coding (0)');
    mapr(result[0].children, (i) => i.done.should.equal(false));
  });

  it('group by context', () => {
    const todos = fromJsonInTodo([{
        "id": 96,
        "text": "#elance",
        "open": true,
        "children": [{
          "id": 100,
          "text": "Test",
          "open": false,
          "children": [],
          "done": true,
          "dateStart": null,
          "dateEnd": null,
          "note": null,
          "previewNote": false
        }],
        "done": false,
        "dateStart": null,
        "dateEnd": null,
        "note": null,
        "previewNote": false
      }, {
        "id": 97,
        "text": "#clients",
        "open": true,
        "children": [{
          "id": 99,
          "text": "Omie",
          "open": false,
          "children": [{
            "id": 102,
            "text": "Richard",
            "open": false,
            "children": [],
            "done": false,
            "dateStart": null,
            "dateEnd": null,
            "note": null,
            "previewNote": false
          }],
          "done": false,
          "dateStart": null,
          "dateEnd": null,
          "note": null,
          "previewNote": false
        }],
        "done": false,
        "dateStart": null,
        "dateEnd": null,
        "note": null,
        "previewNote": false
      }, {
        "id": 101,
        "text": "#home",
        "open": true,
        "children": [],
        "done": false,
        "dateStart": null,
        "dateEnd": null,
        "note": null,
        "previewNote": false
      }]);
  
      const result = transformTodos(todos, {
        filterBy: (i) => !i.done,
        groupBy: (i) => i.text.match(/#(\S*)/g)
      });
    
      result.length.should.equal(3);
      result[0].children.length.should.equal(0);
      result[1].children.length.should.equal(2);
      result[2].children.length.should.equal(0);

      result[0].text.should.equal('#elance (0)');
      result[1].text.should.equal('#clients (2)');
      result[2].text.should.equal('#home (0)');
  
  });

});
