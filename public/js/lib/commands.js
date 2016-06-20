import * as TodoActions from '../actions/todos';
import Command from '../models/Command';
import {take} from 'lodash';

// const IGNORE_SUFFIXES = ['Todo'];

export function parseCommand(cmd) {
  if (!cmd || cmd.trim() == '') return [];
}

export function checkStringOld(command, str) {
  return command.toLowerCase().substr(0, str.length) === str.toLowerCase();
}

/**
 * Calculate relevance of matching command in input
 *
 * @param command
 * @param input
 * @returns {*}
 */
export function matchCommand(command, input) {
  const cmd = command.toLowerCase();
  const str = input.toLowerCase();
  let lastPos = 0;
  let i = 0;
  let pos;
  const result = {
    relevance: -1,
    command: '',
    params: null
  };
  while (i < str.length) {
    if (str[i] == ' ' || str[i] == '_') { // ignore spaces and underscore
      result.command += str[i];
      i++;
      continue;
    }

    pos = cmd.substr(lastPos).search(str[i]);
    if (pos < 0) { // string doesn't match command anymore
      if (i == 0 || str[i-1] != ' ') result.relevance = -1;
      break;
    }

    const letterLower = cmd.substr(lastPos + pos, 1);
    const letterPassed = command.substr(lastPos + pos, 1);

    if (pos == 0) {
      result.relevance += 3; // if sequence of letters
    } else {
      result.relevance += 1; // not next but command
    }

    if (
      letterLower != letterPassed // uppercase in command
      && letterPassed === input[i]  // and uppercase passed
    ) {
      result.relevance += 3;
    }

    result.command += input[i];
    lastPos += pos + 1;
    i++;
  }

  result.params = input.substr(result.command.length);

  return result;
}

export function getParams(cmd) {
  return cmd.trim().search(' ') > 0 && cmd.substr(cmd.search(' ') + 1).trim() || '';
}

export function validateCommand(cmd, state) {
  if (!cmd || cmd.trim() == '') return [];

  const matches = [];

  for (const action in TodoActions) {

    /*IGNORE_SUFFIXES.forEach( (suff) => {
      if (action.substr(action.length - suff.length, suff.length) == suff) {
        // i = i.substr(0, i.length - suff.length);
        return;
      }
    });*/

    const result = matchCommand(action, cmd);
    if (result.relevance > 0) {
      result.action = action;
      matches.push(result);
    }
  }

  return take(matches.sort((a, b) => b.relevance - a.relevance), 3) // sorted by relevance and take 3 top
    .map((o) => {
      const signature = TodoActions[o.action]();
      return new Command(
        o.action,
        o.command,
        o.params,
        getSignature(signature, o, state)
      );
      // TODO : parse arguments
    });
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

/**
 * Process signature and try to predict arguments from params
 *
 * @param signature
 * @param obj matched result
 * @param state
 * @returns {*}
 */
function getSignature(signature, obj, state) {
  for (let i in signature) {
    switch (i) {
      case 'type': continue;
      // case 'id':
      //   const id = state.todos.focusId || state.todos.lastFocusId;
      //   if (!Number.isInteger(id)) return false; // noone element selected
      //   signature['id'] = id;
      //   break;
      default:
        signature[i] = obj.param;
    }
  }
  //console.log(signature);
  return signature;
}
