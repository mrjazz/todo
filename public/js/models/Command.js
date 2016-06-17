export default class Command {

  constructor(action, param, signature) {
    this.action = action;
    this.param = param;
    this.signature = signature;
  }

  toString() {
    const args = [];
    for (const i in this.signature) {
      if (i == 'type' || i == 'id') continue;
      args.push(i);
    }
    return `${this.action} [${args.join('] [')}]`;
  }

}
