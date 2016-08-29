import Todo from '../models/Todo';

function value(o, key, byDefault = '') {
  return o[key] ? o[key] : byDefault;
}

export default function fromJsonInTodo(json) {
  let id = 1;

  function process(json) {
    let result = [];
    for (let item of json) {
      const todo = new Todo(
        value(item, 'id', id++),
        value(item, 'text', ''),
        value(item, 'done', false),
        item.children && item.children.length > 0 ? process(item.children) : []
      );

      todo.open = value(item, 'open', false);
      todo.done = value(item, 'done', false);
      todo.dateStart = value(item, 'dateStart', null);
      todo.dateEnd = value(item, 'dateEnd', null);
      todo.note = value(item, 'note', null);
      todo.previewNote = value(item, 'previewNote', false);

      result.push(todo);
    }
    return result;
  }

  return process(json);
}
