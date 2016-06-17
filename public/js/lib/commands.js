import * as TodoActions from '../actions/todos';

const IGNORE_SUFFIXES = ['Todo'];

export function checkString(command, str) {
  const strLower = str.toLowerCase();

  if (command === str) return true;
  const parts = [];
  let cur = '';
  for(let i in command) {
    const letter = command[i];
    if (letter.toUpperCase() == letter) {
      parts.push(cur);
      cur = letter.toLowerCase();
    } else {
      cur += letter;
    }
  }

  parts.push(cur);

  if (
    command.substr(0, str.length) === strLower ||
    parts.join('-').substr(0, str.length) === strLower ||
    parts.join('_').substr(0, str.length) === strLower ||
    parts.join('').substr(0, str.length) === strLower
  ) {
    return true;
  }
  return false;
}

export function validateCommand(cmd) {
  if (cmd.trim() == '') return [];

  const commands = cmd.split(' ');

  if (commands.length === 0) return [];
  const command = commands[0];

  const matches = [];
  for(const action in TodoActions) {

    /*IGNORE_SUFFIXES.forEach( (suff) => {
      if (action.substr(action.length - suff.length, suff.length) == suff) {
        // i = i.substr(0, i.length - suff.length);
        return;
      }
    });*/

    if (checkString(action, command)) {
      matches.push(action);
    }
  }

  return matches;
}
