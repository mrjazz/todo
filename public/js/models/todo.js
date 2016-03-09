export default class Todo {
    /**
     * @param {number} id
     * @param {string} title
     * @param {boolean} state of complete
     */
    constructor(id, text = '', done = false) {
        this.id = id;
        this.text = text;
        this.done = done;
    }
}
