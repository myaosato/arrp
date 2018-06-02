'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpComma = require(__dirname + '/ArrpComma.js');
const ArrpReader = require(__dirname + '/ArrpReader.js');

const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');
const ArrpMultipleValue = require(__dirname + '/ArrpMultipleValue.js');

const builtins = new Map();
builtins.set('quote', new ArrpSpecial((evaluator, val) =>　{
  return val;
}));

builtins.set('quasi-quote', new ArrpSpecial((evaluator, val) =>　{
  return val; // TODO
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

builtins.set('replace-nth', (arr, ind, val) =>　{
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
