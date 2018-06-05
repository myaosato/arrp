'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpComma = require(__dirname + '/ArrpComma.js');
const ArrpReader = require(__dirname + '/ArrpReader.js');

const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');
const ArrpMultipleValue = require(__dirname + '/ArrpMultipleValue.js');

const ReturnFromFunctionError = require(__dirname + '/ReturnFromFunctionError.js');

const builtins = new Map();
builtins.set('quote', new ArrpSpecial((evaluator, val) =>　{
  return val;
}));

let expandQuasiQuote = (sexp, evaluator) => {
  if (sexp instanceof Array) {
    if (sexp[0] instanceof ArrpSymbol && sexp[0].identifier === 'quasi-quote'){
      evaluator.quasiQuoteCounter++;
      let arr = [sexp[0], expandQuasiQuote(sexp[1], evaluator)];
      evaluator.quasiQuoteCounter--;
      return arr;
    }
    return sexp.map((elt) => expandQuasiQuote(elt, evaluator));
  } else if (sexp instanceof ArrpComma) {
    console.log(evaluator.quasiQuoteCounter + ':' + evaluator.commaCounter)
    if (evaluator.quasiQuoteCounter > evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val = ArrpComma.make(expandQuasiQuote(sexp.sexp, evaluator));
      evaluator.commaCounter--;
      return val;
    } else if (evaluator.quasiQuoteCounter === evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val = evaluator.eval(sexp.sexp);
      evaluator.commaCounter--;
      return val;
    } else {
      return val; // TODO
    }
  } else {
    return sexp;
  }
};

builtins.set('quasi-quote', new ArrpSpecial((evaluator, sexp) =>　{
  evaluator.quasiQuoteCounter++;
  let ret = expandQuasiQuote(sexp, evaluator);
  evaluator.quasiQuoteCounter--;
  return ret;
}));



builtins.set('if', new ArrpSpecial((evaluator, cond, thenSexp, elseSexp) =>　{
  return evaluator.eval(cond) !== false? evaluator.eval(thenSexp): evaluator.eval(elseSexp);
}));

builtins.set('lambda', new ArrpSpecial((evaluator, params, ...body) =>　{
  return new ArrpFunction(evaluator.env, params, body);
}));

builtins.set('defmacro', new ArrpSpecial((evaluator, sym, params, ...body) =>　{
  return evaluator.env.setGlobal(sym, new ArrpMacro(evaluator.env, params, body));
}));

builtins.set('progn', new ArrpSpecial((evaluator, ...body) =>　{
    let tmp = null;
    body.forEach((sexp) => {
      tmp = evaluator.eval(sexp);
    });
    return tmp;
}));

builtins.set('set!', new ArrpSpecial((evaluator, sym, val) =>　{
  if (sym instanceof ArrpSymbol) {
    return evaluator.env.set(sym, evaluator.eval(val));
  }
  return undefined; // TODO
}));

builtins.set('setg!', new ArrpSpecial((evaluator, sym, val) =>　{
  return evaluator.env.setGlobal(sym, evaluator.eval(val));
}));

builtins.set('defun', new ArrpSpecial((evaluator, sym, params, ...body) =>　{
  return evaluator.env.setGlobal(sym, new ArrpFunction(evaluator.env, params, body));
}));

const randomNumeal = (digit) => {
  let ret = '';
  for (let c = 0; c < digit; c++){
    ret += Math.ceil(Math.random() * 10);
  }
  return ret;
}

// MultipleValue
builtins.set('multiple-value-list', new ArrpSpecial((evaluator, sexp) =>　{
  let val = evaluator.eval(sexp);
  if (val instanceof ArrpMultipleValue) {
    return val.values.slice(0);
  } else {
    return [val];
  }
}));

builtins.set('gensym', new ArrpSpecial((evaluator) =>　{
  return ArrpSymbol.make(Symbol(randomNumeal(6)));
}));

builtins.set('let', new ArrpSpecial((evaluator, params, ...body) =>　{
  let vars = params.map((sexp) => sexp instanceof ArrpSymbol? sexp: sexp[0]);
  let vals = params.map((sexp) => sexp instanceof ArrpSymbol? null: evaluator.eval(sexp[1]));

  return (new ArrpFunction(evaluator.env, vars, body)).call(evaluator, vals);
}));

// Read
builtins.set('read', new ArrpSpecial((evaluator, str) =>　{
  let stackOrNull = (new ArrpReader()).read(str, true);
  return stackOrNull? stackOrNull.dequeue(): null;
}));

// Eval
builtins.set('eval', new ArrpSpecial((evaluator, sexp) =>　{
  return evaluator.eval(evaluator.eval(sexp));
}));

// Return
builtins.set('return', ((val) =>　{
  throw new ReturnFromFunctionError(val);
}));

// Array
builtins.set('arrayp', (val) =>　{
  return val instanceof Array;
});

builtins.set('array', (...vals) =>　{
  return Array.from(vals);
});

builtins.set('nth', (arr, ind) =>　{
  return arr[ind];
});

builtins.set('replace-nth!', (arr, ind, val) =>　{
  arr[ind] = val;
  return val;
});

builtins.set('first', (arr) =>　{
  return arr[0];
});

builtins.set('rest', (arr) =>　{
  return arr.slice(1);
});

builtins.set('concat', (arr, ...arrs) =>　{
  return arr.concat.apply(arr, arrs);
});

builtins.set('copy-within!', (arr, target, start, end) =>　{
  if (start === undefined) return arr.copyWith.call(arr, target);
  if (end === undefined) return arr.copyWith.call(arr, target, start);
  return arr.copyWith.call(arr, target, start, end);
});

builtins.set('fill!', (arr, value, start, end) =>　{
  if (start === undefined) return arr.fill.call(arr, value);
  if (end === undefined) return arr.fill.call(arr, value, start);
  return arr.value.call(arr, target, start, end);
});




// Logical
builtins.set('not', (arg) => arg === false? true: false);

// Comparision
const compare = (ifnot) => (...args) => {
  let top = args.shift();
  for (let num of args){
    if (ifnot(top, num)) return false;
    top = num
  }
  return true;
};

builtins.set('=', compare((top, num) => top !== num));
builtins.set('~', compare((top, num) => top != num));
builtins.set('>', compare((top, num) => top <= num));
builtins.set('<', compare((top, num) => top >= num));
builtins.set('>=', compare((top, num) => top < num));
builtins.set('<=', compare((top, num) => top > num));

// Arithemetic　
builtins.set('+', (...numbers) =>　numbers.reduce((prev, curr) => prev + curr));
builtins.set('-', (top, ...numbers) => numbers.length === 0? - top: top - numbers.reduce((prev, curr) => prev + curr));
builtins.set('*', (...numbers) =>　numbers.reduce((prev, curr) => prev * curr));
builtins.set('/', (top, ...numbers) => numbers.length === 0? 1 / top: top / numbers.reduce((prev, curr) => prev * curr));
builtins.set('rem', (num1, num2) => new ArrpMultipleValue(Math.floor(num1 / num2), num1 % num2));

// EXPORTS
module.exports = builtins;
