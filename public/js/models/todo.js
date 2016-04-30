export default class Todo {
  /**
   * @param {Number} id
   * @param {String} title
   * @param {Boolean} state of complete
   */
  constructor(id, text = '', done = false, children = []) {
    this.id = id;
    this.text = text;
    this.done = done;
    this.children = children;
  }

  add(todo) {
    this.children.push(todo);
  }
}
