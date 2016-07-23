export default class TreeNode {
  constructor(id, text = '', children = []) {
    this.id = id;
    this.text = text;
    this.open = false;
    this.children = children;
  }

  add(todo) {
    this.children.push(todo);
  }

  toString() {
    return this.text;
  }
}
