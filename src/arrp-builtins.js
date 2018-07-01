'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpReader = require(__dirname + '/ArrpReader.js');

const arrpPrint = require(__dirname + '/arrp-print.js');

const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpJsMethod = require(__dirname + '/ArrpJsMethod.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');
const ArrpMultipleValue = require(__dirname + '/ArrpMultipleValue.js');

const ReturnFromFunctionError = require(__dirname + '/ReturnFromFunctionError.js');

const expandQuasiQuote = require(__dirname + '/expand-quasi-quote.js')

const builtins = new Map();

// Quote

builtins.set('quote', new ArrpSpecial((evaluator, val) =>　{
  return val;
}));


builtins.set('quasi-quote', new ArrpSpecial((evaluator, sexp) =>　{
  evaluator.quasiQuoteCounter++;
  let ret;
  try {
    ret = expandQuasiQuote(sexp, evaluator);
  } catch (e){
    throw e;
  } finally {
    evaluator.quasiQuoteCounter--;
  }
  return ret;
}));

// if and cond

builtins.set('if', new ArrpSpecial((evaluator, cond, thenSexp, elseSexp) =>　{
  return evaluator.eval(cond) !== false? evaluator.eval(thenSexp): evaluator.eval(elseSexp);
}));

builtins.set('cond', new ArrpSpecial((evaluator, ...cond_bodys) =>　{
  for (let cond_body of cond_bodys) {
    if (!cond_body instanceof Array) throw Error('cond form error') // TODO
    if (evaluator.eval(cond_body[0]) !== false) {
      return evaluator.eval([ArrpSymbol.make('progn')].concat(cond_body.slice(1)));
    }
  }
  return undefined;
}));

// progn

builtins.set('progn', new ArrpSpecial((evaluator, ...body) =>　{
    let tmp = null;
    body.forEach((sexp) => {
      tmp = evaluator.eval(sexp);
    });
    return tmp;
}));

// lambda and let

builtins.set('lambda', new ArrpSpecial((evaluator, paramSexp, ...body) =>　{
  return new ArrpFunction(evaluator.env, paramSexp, body);
}));

builtins.set('let', new ArrpSpecial((evaluator, params, ...body) =>　{
  let vars = params.map((sexp) => sexp instanceof ArrpSymbol? sexp: sexp[0]);
  let vals = params.map((sexp) => sexp instanceof ArrpSymbol? null: evaluator.eval(sexp[1]));

  return (new ArrpFunction(evaluator.env, vars, body)).call(evaluator, vals);
}));

// set and delete

builtins.set('set!', new ArrpSpecial((evaluator, sym, val) =>　{
  if (sym instanceof ArrpSymbol) {
    return evaluator.env.set(sym, evaluator.eval(val));
  }
  return undefined; // TODO
}));

builtins.set('set-g!', new ArrpSpecial((evaluator, sym, val) =>　{
  return evaluator.env.setGlobal(sym, evaluator.eval(val));
}));

builtins.set('delete-g!', new ArrpSpecial((evaluator, sym) =>　{
  return evaluator.env.deleteGlobal(sym);
}));

// defun and defmacro

builtins.set('defun!', new ArrpSpecial((evaluator, sym, paramSexp, ...body) =>　{
  return evaluator.env.setGlobal(sym, new ArrpFunction(evaluator.env, paramSexp, body));
}));

builtins.set('defmacro!', new ArrpSpecial((evaluator, sym, params, ...body) =>　{
  return evaluator.env.setGlobal(sym, new ArrpMacro(evaluator.env, params, body));
}));

builtins.set('gensym', new ArrpSpecial((evaluator) =>　{
  let rand = '';
  for (let c = 0; c < 6; c++){
    rand += Math.floor(Math.random() * 10);
  }
  return ArrpSymbol.make(Symbol(rand));
}));

// MultipleValue
builtins.set('multiple-value-list', new ArrpSpecial((evaluator, sexp) =>　{
  let val = evaluator.eval(sexp);
  if (val instanceof ArrpMultipleValue) {
    return val.values.slice(0);
  } else {
    return [val];
  }
}));

// Read
builtins.set('read', new ArrpSpecial((evaluator, str) =>　{
  let stackOrNull = (new ArrpReader()).read(str, true);
  return stackOrNull? stackOrNull.dequeue(): null;
}));

// Print
builtins.set('print', arrpPrint);

// Eval
builtins.set('eval', new ArrpSpecial((evaluator, sexp) =>　{
  return evaluator.eval(evaluator.eval(sexp));
}));

// Return
builtins.set('return', new ArrpSpecial((evaluator, sexp) =>　{
  throw new ReturnFromFunctionError(sexp, evaluator.env.getLexicalEnvs());
}));

// Package
builtins.set('change-package!', new ArrpSpecial((evaluator, pkg) =>　{
  let name = 'ARRP-USER';
  if (pkg instanceof ArrpSymbol) {
    name = pkg.identifier;
  } else if (typeof pkg === 'string') {
    name = pkg;
  } else {
    return 'package must be specified by string or symbol';
  }
  if (name.toUpperCase() === 'JS') {
    return 'can not change to JS package.';
  }
  return evaluator.env.changePkg(name.toUpperCase());
}));
builtins.set('current-package', new ArrpSpecial((evaluator) =>　{
  return evaluator.env.getPkg();
}));

// JS Method
builtins.set('jsm', new ArrpSpecial((evaluator, id) =>　{
  return new ArrpJsMethod(id);
}));

// as JS Function
builtins.set('as-jsf', new ArrpSpecial((evaluator, func) =>　{
  func = evaluator.eval(func);
  if (func instanceof ArrpFunction) {
    return (...args) => func.call(evaluator, args);
  } else {
    return null;
  }
}))

// URI
builtins.set('decode-uri', decodeURI)
builtins.set('encode-uri', encodeURI)
builtins.set('decode-uri-component', decodeURIComponent)
builtins.set('encode-uri-component', encodeURIComponent)

// Logical
builtins.set('not', (arg) => arg === false? true: false);
builtins.set('and', (...args) => {
    for (let elt of args){
      if (elt === false) return false;
    }
    return args[args.length -1];
});
builtins.set('or', (...args) => {
    for (let elt of args){
      if (elt !== false) return elt;
    }
    return false;
});

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

builtins.set('/=', (...number) => {
  if (number.length === 0) return true;
  let uniq = number.filter((elt, ind, arr) => arr.indexOf(elt) === ind);
  return uniq.length === number.length;
});

// Arithemetic　
builtins.set('+', (...numbers) =>　numbers.reduce((prev, curr) => prev + curr));
builtins.set('-', (top, ...numbers) => numbers.length === 0? - top: top - numbers.reduce((prev, curr) => prev + curr));
builtins.set('*', (...numbers) =>　numbers.reduce((prev, curr) => prev * curr));
builtins.set('/', (top, ...numbers) => numbers.length === 0? 1 / top: top / numbers.reduce((prev, curr) => prev * curr));
builtins.set('%', (top, ...numbers) => numbers.length === 0? top: numbers.reduce((prev, curr) => prev % curr, top));
builtins.set('rem', (num1, num2) => new ArrpMultipleValue(Math.floor(num1 / num2), num1 % num2));

// Object TODO
builtins.set('new-object', () => {return {};});
builtins.set('get-prop', (obj, prop) => obj[prop]);
builtins.set('.', new ArrpSpecial((evaluator, obj, prop) =>　{
  let propName = '';
  if (prop instanceof ArrpSymbol) {
    propName = prop.identifier;
  } else if (typeof prop === 'string') {
    propName = prop;
  } else if (typeof prop === 'number') {
    propName = prop;
  } else {
    return null;
  }
  return evaluator.eval(obj)[propName];
}));
builtins.set('set-prop!', (obj, prop, val) => obj[prop] = val);

// Math
builtins.set('+E+', Math.E);
builtins.set('+LN-2+', Math.LN2);
builtins.set('+LN-10+', Math.LN10);
builtins.set('+LOG-2-E+', Math.LOG2E);
builtins.set('+LOG-10-E+', Math.LOG10E);
builtins.set('+PI+', Math.PI);
builtins.set('+SQRT-1/2+', Math.SQRT1_2);
builtins.set('+SQRT-2+', Math.SQRT2);

const mathFuncNames = [
  'abs',
  'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh',
  'cos', 'cosh', 'sin', 'sinh', 'tan', 'tanh',
  'exp', 'expm1', 'log', 'log1p', 'log10',
  'cbrt', 'sqrt',
  'ceil', 'floor', 'trunc',
  'fround', 'round',
  'clz32', 'sign',
  'atan2', 'hypot', 'imul', 'max', 'min', 'pow'
];
for (let name of mathFuncNames) {
  builtins.set(name, Math[name]);
}

// Number
builtins.set('+EPSILON+', Number.EPSILON);
builtins.set('+MAX-SAFE-INTEGER+', Number.MAX_SAFE_INTEGER);
builtins.set('+MIN-SAFE-INTEGER+', Number.MIN_SAFE_INTEGER);
builtins.set('+MAX-VALUE+', Number.MAX_VALUE);
builtins.set('+MIN-VALUE+', Number.MIN_VALUE);

builtins.set('is-NaN', Number.isNaN);
builtins.set('is-finite', Number.isFinite);
builtins.set('is-integer', Number.isInteger);
builtins.set('is-safe-nteger', Number.isSafeInteger);
builtins.set('parse-float', Number.parseFloat);
builtins.set('parse-int', Number.parseInt);
builtins.set('to-exponential', (num, fd) => (new Number(num)).toExponential(fd));
builtins.set('to-fixed', (num, digits) => (new Number(num)).toFixed(digits));
builtins.set('to-precision', (num, precision) => (new Number(num)).toPrecision(precision));

// Date
builtins.set('date', (year, month = 1, day = 1, hour = 0, minutes = 0, seconds = 0, milliseconds = 0) => new Date(year, month - 1, day, hour, minutes, seconds, milliseconds));
builtins.set('date-from-time', (time) => new Date(time));
builtins.set('date-now', Date.now);
builtins.set('date-utc', Date.UTC);

// RegExp
builtins.set('regex', (pattern, flags) => RegExp(pattern, flags));

// String
builtins.set('from-char-code', String.fromCharCode);
builtins.set('from-code-point', String.fromCodePoint);

// Array
builtins.set('array', (...vals) =>　Array.from(vals));
builtins.set('nth', (arr, ind) =>　arr[ind]);
builtins.set('replace-nth!', (arr, ind, val) =>　arr[ind] = val);
builtins.set('first', (arr) =>　arr[0]);
builtins.set('rest', (arr) =>　arr.slice(1));
builtins.set('cons', (first, rest) =>　([first]).concat(rest));
builtins.set('last', (arr) =>　arr[arr.length - 1]);
builtins.set('fill!', (arr, ...args) => arr.fill.apply(arr, args));
builtins.set('push!', (arr, ...vals) => arr.push.apply(arr, vals));
builtins.set('pop!', (arr) => arr.pop());
builtins.set('unshift!', (arr, ...vals) => arr.unshift.apply(arr, vals));
builtins.set('shift!', (arr) => arr.shift());
builtins.set('splice!', (arr, ...args) => arr.splice.apply(arr, args));
builtins.set('concat', (obj, ...arrs) =>　obj.concat.apply(obj, arrs));
builtins.set('length', (obj) =>　obj.length);
builtins.set('slice', (obj, ...args) =>　obj.slice.apply(obj, args));
builtins.set('copy-within!', (arr, ...args) => arr.copyWithin.apply(arr, args));
builtins.set('reverse!', (arr) => arr.reverse());
builtins.set('sort!', (arr) => arr.sort()); // TODO
builtins.set('join', (arr, sep) =>　arr.join(sep));
builtins.set('index-of', (obj, ...args) =>　obj.indexOf.apply(obj, args));
builtins.set('last-index-of', (obj, ...args) =>　obj.lastIndexOf.apply(obj, args));

// ArrayBuffer
builtins.set('array-buffer', (length) => new ArrayBuffer(length));

// Typed Array
const typedArray = {
  'int-8-array': Int8Array,
  'uint-8-array': Uint8Array,
  'uint-8-clamped-array': Uint8ClampedArray,
  'int-16-array': Int16Array,
  'uint-16-array': Uint16Array,
  'int-32-array': Int32Array,
  'uint-32-array': Uint32Array,
  'float-32-array': Float32Array,
  'float-64-array': Float64Array,
};

for (let name in typedArray){
  builtins.set(name, (...args) => {
    if (args.length === 0) {
      return new typedArray[name]();
    } else if (args.length === 1) {
      return new typedArray[name](args[0]);
    } else if (args.length === 2) {
      return new typedArray[name](args[0], args[1]);
    } else if (args.length === 3) {
      return new typedArray[name](args[0], args[1], args[2]);
    }
    throw Error('invalid argumens');
  });
}

// DataView
builtins.set('data-view', (...args) => {
  if (args.length === 0) {
    return new DataView();
  } else if (args.length === 1) {
    return new DataView(args[0]);
  } else if (args.length === 2) {
    return new DataView(args[0], args[1]);
  } else if (args.length === 3) {
    return new DataView(args[0], args[1], args[2]);
  }
  throw Error('invalid argumens');
});

// Map
builtins.set('make-map', (arg) => new Map(arg));

// Set
builtins.set('make-set', (arg) => new Set(arg));

// JSON
builtins.set('json-parse', (str) =>　JSON.parse(str));
builtins.set('json-stringify', (val) =>　JSON.stringify(val));

// Intl
builtins.set('intl-collator', (...args) => Intl.Collator.apply(null,args));

builtins.set('intl-datetime-format', (...args) => Intl.DateTimeFormat.apply(null,args));

builtins.set('intl-number-format', (...args) => Intl.NumberFormat.apply(null,args));

// EXPORTS
module.exports = builtins;
