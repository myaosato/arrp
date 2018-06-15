'use strict';
const ArrpSexpStack = require(__dirname + '/ArrpSexpStack.js')
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpComma = require(__dirname + '/ArrpComma.js');
const ArrpCommaAt = require(__dirname + '/ArrpCommaAt.js');

class ArrpReader{
  constructor() {
    this.__stack = [[]];
    this.__quote = [];
  }

  __setQuote(str) {
    return this.__quote.push(str);
  }

  __push(sexp) {
    if (this.__quote.length > 0) {
      let quote = this.__quote.pop();
      if (quote === "'") {
        sexp = [ArrpSymbol.make('quote'), sexp];
      } else if (quote === '`') {
        sexp = [ArrpSymbol.make('quasi-quote'), sexp];
      } else if (quote === ',') {
        sexp = ArrpComma.make(sexp);
      } else if (quote === ',@') {
        sexp = ArrpCommaAt.make(sexp);
      }
      return this.__push(sexp)
    }
    return this.__stack[this.__stack.length - 1].push(sexp);
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
    if (str === 'Infinity') return Number.POSITIVE_INFINITY;
    if (str === '-Infinity') return Number.NEGATIVE_INFINITY;
    if (str === 'NaN') return Number.NaN;
    if (str === 'undefined') return undefined;
    if (str === 'null') return null;
    // Boolean
    if (str === 'true') return true;
    if (str === 'false') return false;
    // Integer
    if (str.match(/^[+-]?[1-9]\d*$/)) return Number(str);
    if (str.match(/^[+-]?0[oO][0-7]+$/)) return Number(str);
    if (str.match(/^[+-]?0[xX][\da-fA-F]+$/)) return Number(str);
    if (str.match(/^[+-]?0[bB][01]+$/)) return Number(str);
    // Float
    if (str.match(/^[+-]?(\d+(.\d*)?|.\d+)([Ee][+-]?\d+)?$/)) return Number(str);
    // String
    if (str.match(/^"([^\\"]|\\0|\\b|\\f|\\n|\\r|\\t|\\v|\\'|\\"|\\\\|\\[0-3][0-7][0-7]|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]{5}\})*"$/)) return eval(str);
    //
    return new ArrpSymbol(str);
  }

  __makeToken(input, pos) {
    let stack = [];
    while (true) {
      stack.push(String.fromCodePoint(input.codePointAt(pos)));
      pos++;
      if (input.codePointAt(pos) === undefined
        || String.fromCodePoint(input.codePointAt(pos)) === '('
        || String.fromCodePoint(input.codePointAt(pos)) === ')'
        || String.fromCodePoint(input.codePointAt(pos)) === ';'
        || String.fromCodePoint(input.codePointAt(pos)) === "'"
        || String.fromCodePoint(input.codePointAt(pos)) === '`'
        || String.fromCodePoint(input.codePointAt(pos)) === ','
        || String.fromCodePoint(input.codePointAt(pos)).match(/^\s/)) {
       return [this.__resolveLiteral(stack.join('')), pos, true];
      }
    }
  }

  __makeString(input, pos) {
    let stack = [];
    while (true) {
      stack.push(String.fromCodePoint(input.codePointAt(pos)));
      if (String.fromCodePoint(input.codePointAt(pos)) === '\\') {
        pos++;
        stack.push(String.fromCodePoint(input.codePointAt(pos)));
      }
      pos++;
      if (String.fromCodePoint(input.codePointAt(pos)) === '"') {
        stack.push(String.fromCodePoint(input.codePointAt(pos)));
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
      if (input.codePointAt(pos) === undefined
      || String.fromCodePoint(input.codePointAt(pos)) === '\n') {
        pos++;
        return ['', pos, null];
      }
      if (pos > input.length) {
        throw Error(input + ": " + pos);
      }
    }
  }

  __getToken(input, pos) {
    if (input.codePointAt(pos) === undefined) return [null, false, null];
    if (String.fromCodePoint(input.codePointAt(pos)) === "'") return ["'", pos + 1, "'"];
    if (String.fromCodePoint(input.codePointAt(pos)) === '`') return ['`', pos + 1, '`'];
    if (String.fromCodePoint(input.codePointAt(pos)) === ',') {
      if (input[pos + 1] === '@') return [',@', pos + 2, `,@`];
      return [',', pos + 1, `,`];
    }
    if (String.fromCodePoint(input.codePointAt(pos)) === '(') return ['(', pos + 1, '('];
    if (String.fromCodePoint(input.codePointAt(pos)) === ')') return [')', pos + 1, ')'];
    if (String.fromCodePoint(input.codePointAt(pos)).match(/^\s/)) return ['', pos + 1, null];
    if (String.fromCodePoint(input.codePointAt(pos)) === ';') return this.__purgeComment(input, pos);
    if (String.fromCodePoint(input.codePointAt(pos)) === '"') return this.__makeString(input, pos);
    return this.__makeToken(input, pos);
  };

  __parse(input, readOne = false) {
    let pos = 0;
    let chk;
    let token = null;
    while (true) {
      [token, pos, chk] = this.__getToken(input, pos);
      if (token === "'"
        || token === '`'
        || token === `,`
        || token === `,@`
      ) {
        this.__setQuote(token);
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
