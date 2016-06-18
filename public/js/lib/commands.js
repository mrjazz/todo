import * as TodoActions from '../actions/todos';
import Command from '../models/Command';

// const IGNORE_SUFFIXES = ['Todo'];

export function checkString(command, str) {
  return command.toLowerCase().substr(0, str.length) === str.toLowerCase();
}

export function getParams(cmd) {
  return cmd.trim().search(" ") > 0 && cmd.substr(cmd.search(" ") + 1).trim() || '';
}

export function validateCommand(cmd) {
  if (!cmd || cmd.trim() == '') return [];

  const commands = cmd.split(' ');

  if (commands.length === 0) return [];
  const command = commands[0];
  const matches = [];

  for (const action in TodoActions) {

    /*IGNORE_SUFFIXES.forEach( (suff) => {
      if (action.substr(action.length - suff.length, suff.length) == suff) {
        // i = i.substr(0, i.length - suff.length);
        return;
      }
    });*/

    if (checkString(action, command)) {
      const command = new Command(action, getParams(cmd), TodoActions[action]());
      matches.push(command);
    }
  }

  return matches;
}

export function execCommand(cmd, store) {
  const command = validateCommand(cmd);
  if (!command || command.length != 1) return; // nothing to process
  const signature = command[0].signature;
  for (let i in signature) {
    if (i == 'type') continue;
    if (i == 'id' && store) {
      const id = store.getState().todos.focusId || store.getState().todos.lastFocusId;
      if (!Number.isInteger(id)) return false; // noone element selected
      signature['id'] = id;
      continue;
    }
    signature[i] = getParams(cmd);
  }

  store.dispatch(signature);
}
