import TreeNode from './TreeNode';

export default  class Todo extends TreeNode {

  /**
   * @param {Number} id
   * @param {String} title
   * @param {Boolean} state of complete
   */
  constructor(id, text = '', done = false, children = []) {
    super(id, text, children);
    // this.id = id;
    // this.text = text;
    // this.children = children;
    this.done = done;
    this.dateStart = null;
    this.dateEnd = null;
    this.note = null;
    this.previewNote = false;
  }

}
