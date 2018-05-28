'use strict';
const ArrpSexpStack = require(__dirname + '/ArrpSexpStack.js')

const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');

const resolveLiteral = (str) => {
  if (str === 'Infinity') return Infinity;
  if (str === 'NaN') return new ArrpSymbol('NaN');
  if (str === 'undefined') return undefined;
  if (str === 'null') return null;
  // Boolean
  if (str === 'true') return true;
  if (str === 'false') return false;
  // Integer
  if (str.match(/^[+-]?[1-9]\d*$/)) return eval(str);
  if (str.match(/^[+-]?0[oO][0-7]+$/)) return eval(str);
  if (str.match(/^[+-]?0[xX][\da-fA-F]+$/)) return eval(str);
  if (str.match(/^[+-]?0[bB][01]+$/)) return eval(str);
  // Float
  if (str.match(/^[+-]?(\d+(.\d*)?|.\d+)([Ee][+-]?\d+)?$/)) return eval(str);
  // String
  if (str.match(/^"([^\\"]|\\0|\\b|\\f|\\n|\\r|\\t|\\v|\\'|\\"|\\\\|\\[0-3][0-7][0-7]|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]{5}\})*"$/)) return eval(str);
  // Regex TODO
  //
  return new ArrpSymbol(str);
}


const stackChar = (input, pos, str_mode) => {
  let stack = [];
  while (true) {
    stack.push(input[pos]);
    if (input[pos] === '\\') {
      pos++;
      stack.push(input[pos]);
    }
    pos++;
    if (input[pos] === '"' && str_mode === true) {
      stack.push(input[pos]);
      pos++;
      return [resolveLiteral(stack.join('')), pos, true];
    }
    if (input[pos] === undefined
      || input[pos] === '('
      || input[pos] === ')'
      || (input[pos].match(/^\s/) && str_mode === false)) {
     return [resolveLiteral(stack.join('')), pos, true];
    }
  }
};

const getToken = (input, pos) => {
  if (input[pos] === undefined) return [null, false, null];
  if (input[pos] === '(') return ['(', pos + 1, '('];
  if (input[pos] === ')') return [')', pos + 1, ')'];
  if (input[pos].match(/^\s/)) return [' ', pos + 1, null];
  return stackChar(input, pos, input[pos] === '"');
};

const parse = (input) => {
  let pos = 0;
  let chk;
  let token = null;
  let stack = [[]];
  while (true) {
    [token, pos, chk] = getToken(input, pos);
    if (pos === false) break;
    if (chk === null) continue;
    if (token === '(') {
      let arr = [];
      stack[stack.length - 1].push(arr);
      stack.push(arr);
      continue;
    }
    if (token === ')') {
      stack.pop();
      continue;
    }
    stack[stack.length - 1].push(token);
  }
  return new ArrpSexpStack(stack[0]);
};

const read = (str) => {
  return parse(str);
};

module.exports = read;
