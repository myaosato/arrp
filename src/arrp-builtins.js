'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');

const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');

const builtins = new Map();
builtins.set('quote', new ArrpSpecial((evaluator, val) =>　{
  return val;
}));

builtins.set('if', new ArrpSpecial((evaluator, cond, thenSexp, elseSexp) =>　{
  return evaluator.eval(cond) !== false? evaluator.eval(thenSexp): evaluator.eval(elseSexp);
}));

builtins.set('lambda', new ArrpSpecial((evaluator, params, ...body) =>　{
  return new ArrpFunction(evaluator.env, params, body);
}));

builtins.set('progn', new ArrpSpecial((evaluator, ...body) =>　{
    let tmp = null;
    body.forEach((sexp) => {
      tmp = evaluator.eval(sexp);
    });
    return tmp;
}));

builtins.set('set!', new ArrpSpecial((evaluator, sym, val) =>　{
  return evaluator.env.set(sym, evaluator.eval(val));
}));

builtins.set('setg!', new ArrpSpecial((evaluator, sym, val) =>　{
  return evaluator.env.setGlobal(sym, evaluator.eval(val));
}));

builtins.set('defun', new ArrpSpecial((evaluator, sym, params, ...body) =>　{
  return evaluator.env.setGlobal(sym, new ArrpFunction(evaluator.env, params, body));
}));


// Array
builtins.set('arrayp', (val) =>　{
  return val instanceof Array ;
});

builtins.set('nth', (arr, ind) =>　{
  return arr[ind] ;
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


// EXPORTS
module.exports = builtins;
