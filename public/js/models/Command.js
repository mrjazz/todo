export default class Command {

  constructor(action, matchedAction, param, signature) {
    this.action = action;
    this.matchedAction = matchedAction;
    this.param = param;
    this.signature = signature;
  }

  toString() {
    const args = [];
    for (const i in this.signature) {
      if (i == 'type') continue;
      if (i == 'id') {
        args.push('item');
      } else {
        args.push(i);
      }
    }
    return `${this.action} [${args.join('] [')}]`;
  }

}
