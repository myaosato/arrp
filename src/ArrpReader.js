'use strict';
const ArrpSexpStack = require(__dirname + '/ArrpSexpStack.js')
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');

class ArrpReader{
  constructor() {
    this.__stack = [[]];
    this.__quote = [];
  }

  __setQuote(str) {
    return this.__quote.push(ArrpSymbol.make(str));
  }

  __push(sexp) {
    if (this.__quote.length > 0) {
      let quoteSym = this.__quote.pop();
      return this.__stack[this.__stack.length - 1].push([quoteSym, sexp]);
    } else {
      return this.__stack[this.__stack.length - 1].push(sexp);
    }
  }

  __makeArray() {
    let arr = [];
    this.__push(arr);
    return this.__stack.push(arr);
  }

  __pop() {
    return this.__stack.pop();
  }

  __resolveLiteral(str) {
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

  __makeToken(input, pos) {
    let stack = [];
    while (true) {
      stack.push(input[pos]);
      pos++;
      if (input[pos] === undefined
        || input[pos] === '('
        || input[pos] === ')'
        || input[pos] === ';'
        || input[pos] === "'"
        || input[pos].match(/^\s/)) {
       return [this.__resolveLiteral(stack.join('')), pos, true];
      }
    }
  }

  __makeString(input, pos) {
    let stack = [];
    while (true) {
      stack.push(input[pos]);
      if (input[pos] === '\\') {
        pos++;
        stack.push(input[pos]);
      }
      pos++;
      if (input[pos] === '"') {
        stack.push(input[pos]);
        pos++;
        return [this.__resolveLiteral(stack.join('')), pos, true];
      }
      if (pos >= input.length) {
        throw Error(input + ": " + pos);
      }
    }
  }

  __purgeComment(input, pos) {
    while (true) {
      pos++
      if (input[pos] === '\n'
      || input[pos] === undefined) {
        pos++;
        return ['', pos, null];
      }
      if (pos > input.length) {
        throw Error(input + ": " + pos);
      }
    }
  }

  __Comma(input, pos) {
    // TODO
    let stack = (new ArrpReader()).read(input.slice(pos + 1), true); // TODO
    new ArrpComma(sexp)
  }

  __getToken(input, pos) {
    if (input[pos] === undefined) return [null, false, null];
    if (input[pos] === "'") return ["'", pos + 1, "'"];
    if (input[pos] === '(') return ['(', pos + 1, '('];
    if (input[pos] === ')') return [')', pos + 1, ')'];
    if (input[pos].match(/^\s/)) return ['', pos + 1, null];
    if (input[pos] === ';') return this.__purgeComment(input, pos);
    if (input[pos] === '"') return this.__makeString(input, pos);
    //if (input[pos] === ',') return this.__makeComma(input, pos); TODO
    return this.__makeToken(input, pos);
  };

  __parse(input, readOne = false) {
    let pos = 0;
    let chk;
    let token = null;
    while (true) {
      [token, pos, chk] = this.__getToken(input, pos);
      if (token === "'") {
        this.__setQuote('quote');
        continue;
      }
      if (pos === false) break;
      if (chk === null) continue;
      if (token === '(') {
        this.__makeArray();
        continue;
      }
      if (token === ')') {
        this.__pop();
        continue;
      }
      this.__push(token);
    }
    if (this.__stack.length > 1) return null; // TODO
    if (this.__stack.length === 0) throw new Error(); // TODO
    if (readOne && this.__stack.length === 1) return new ArrpSexpStack(this.__stack[0]);
    return new ArrpSexpStack(this.__stack[0]);
  };

  read(str, readOne = false) {
    let stack = this.__parse(str, readOne);
    if (stack !== null) this.__stack = [[]];
    return stack;
  };
}

module.exports = ArrpReader;
