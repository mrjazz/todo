export default class CommandParam {

  constructor(type, hint) {
    this.type  = type;
    this.hint  = hint;
    this.value = null;
    this.options = [];
  }

}
