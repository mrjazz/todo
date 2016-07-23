import Command from '../models/Command';
import CommandParam from '../models/CommandParam';
import * as TodoAction from '../constants/TodoActionTypes';
import * as TodoActions from '../actions/todos';
import * as FilterTypes from '../constants/FilterTypes';
import {callr, findr} from '../lib/collectionUtils';
import {dateParse} from '../lib/dates';
import {take, keys, values} from 'lodash';


export function parseCommand(cmd) {
  if (!cmd || cmd.trim() == '') return [];
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
      // if (command == 'addBelow') console.log(str[i-1], result.relevance);
      if (i == 0 || str[i-1] != ' ') {
        if (result.relevance < 15) {
          result.relevance = -1;
        }
      }
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
      const signature = getSignatureForAction(o.action);
      return new Command(
        o.action,
        o.command,
        o.params,
        getSignature(signature, o, state)
      );
      // TODO : parse arguments
    });
}

function getSignatureForAction(action) {
  return TodoActions[action]();
}

export function execCommand(cmd, store) {
  const commands = validateCommand(cmd, store.getState().todos);

  if (!commands || commands.length == 0) return; // nothing to process

  const command = commands[0];
  const signature = command.signature;

  for (let i in signature) {
    if (i == 'type') continue;
    signature[i] = printValue(signature[i].value ? signature[i].value : signature[i].options[0]);
  }

  store.dispatch(signature);
}

function typeHint(type) {
  switch (type) {
    case 'id':
    case 'parentId':
      return 'id of todo or selected id by default';
    case 'filter':
      return keys(FilterTypes).join(', ');
    case 'date':
      return 'any date or current time by default';
    case 'text':
    case 'note':
    case 'todo':
      return '"some text"';
    default:
      return 'unknown type of param';
  }
}

/**
 * Choose value for type or propose options
 * TODO : implement option proposition
 *
 * @param value
 * @param type
 * @param state
 * @returns CommandParam
 */
export function valueOfTypeByState(value, type, state) {
  const result = new CommandParam(type, typeHint(type));
  switch (type) {
    case 'id':
    case 'parentId':
      if(value == undefined) return result; // no sense continue without value;
      if (value.trim() === '') {
        if (!!state.lastFocusId) {
          const lastTodo = findr(state.todos, (todo) => todo.id === state.lastFocusId);
          if (lastTodo) {
            result.options.push(lastTodo);
          }
        }
      } else {
        callr(state.todos, (todo) => {
          const a = todo.text.toLowerCase();
          const b = value.toLowerCase();
          if (a == b) result.value = todo;
          if (a.search(b) >= 0) {
            result.options.push(todo);
          }
        });
      }
      return result;
    case 'filter':
      values(FilterTypes).filter((i) => {
        const a = i.toLowerCase();
        const b = value.toLowerCase();
        if (a == b) result.value = i;
        if (a.search(b) >= 0) {
          result.options.push(i);
        }
      });
      return result;
    case 'date':
      result.value = dateParse(value);
      result.options.push(new Date());
      return result;
    default:
      result.value = value;
      return result;
  }
}

function validArgs(signature) {
  return keys(signature).filter((o) => o != 'type');
}

/**
 * Process signature and try to predict arguments from params
 *
 * @param signature
 * @param obj matched result
 * @param state
 * @returns {*}
 */
function getSignature(signature, match, state) {
  const args = validArgs(signature);

  if (args.length < 1) {
    return signature; // no need in parsing params
  } else if (args.length == 1) {
    signature[args[0]] = valueOfTypeByState(match.params, args[0], state); // everything is param
  } else {
    // parse values and apply them
    // console.log(match.params.search(/[\"\'](.*?)[\"\']/g));
    const re = new RegExp(/["'](.*?)["']/g);
    let res;
    const values = [];

    while ((res = re.exec(match.params)) != null) {
      values.push(res[1]);
    }

    if (values.length == 0) values.push(match.params);

    validArgs(signature).map((name, i) => {
      signature[name] = valueOfTypeByState(values[i], name, state); // everything is param
    });
  }

  return signature;
}

function wrapWithTag(tag, html) {
  return `<${tag}>${html}</${tag}>`;
}

function printArgument(arg) {
  switch (typeof arg) {
    case 'object':
      return arg.text;
    default:
        return arg.toString();
  }
}

function printValue(arg) {
  switch (typeof arg) {
    case 'object':
      return arg.id;
    default:
      return arg.toString();
  }
}

function hintForNotMatchedParam(param) {
  return !param.value && param.options.length > 0 ? '"' + printArgument(param.options[0]) + '"?' : param.hint;
}

function hintForParam(name, param) {
  if (param.value) {
    return wrapWithTag('b', `${name} : "${printArgument(param.value)}"`);
  } else {
    return wrapWithTag('i', `${name} : ${hintForNotMatchedParam(param)}`);
  }
}

function hintForMatched(cmd) {
  return wrapWithTag('b', cmd.action) + ' ' +
    validArgs(cmd.signature).map((name) => {
      return !!cmd[name] ? `[${wrapWithTag('b', name)}]` : `[${hintForParam(name, cmd.signature[name])}]`;
    }).join(', ');
}

export function getHint(commands) {
  return commands.map((command, i) => {
    return i == 0 ? hintForMatched(command) : command; // highlight first matched command
  }).join(', ');

  // let result = '';
  // if (commands.length == 1) {
  //   const cmd = commands[0];
  //   result += '<b>' + cmd.action + '</b> ';
  //
  //    return result + validArgs(cmd.signature)
  //       .map((name, i) => {
  //         return !!cmd[name] ? `[<b>${name}</b>]` : `[<i>${name} : ${cmd.signature[name].hint}</i>]`;
  //       })
  //       .join(', ');
  // }
  //
  // return commands.join(', ');
}
