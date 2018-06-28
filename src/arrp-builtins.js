'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpComma = require(__dirname + '/ArrpComma.js');
const ArrpCommaAt = require(__dirname + '/ArrpCommaAt.js');
const ArrpReader = require(__dirname + '/ArrpReader.js');

const arrpPrint = require(__dirname + '/arrp-print.js');

const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpJsMethod = require(__dirname + '/ArrpJsMethod.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');
const ArrpMultipleValue = require(__dirname + '/ArrpMultipleValue.js');
const ArrpExpandedValues = require(__dirname + '/ArrpExpandedValues.js');

const ReturnFromFunctionError = require(__dirname + '/ReturnFromFunctionError.js');

const builtins = new Map();

builtins.set('quote', new ArrpSpecial((evaluator, val) =>　{
  return val;
}));

let expandQuasiQuote = (sexp, evaluator) => {
  if (sexp instanceof Array) {
    if (sexp[0] instanceof ArrpSymbol && sexp[0].identifier === 'quasi-quote'){
      evaluator.quasiQuoteCounter++;
      let arr;
      try {
        arr = [sexp[0], expandQuasiQuote(sexp[1], evaluator)];
      } catch (e) {
        throw e;
      } finally {
        evaluator.quasiQuoteCounter--;
      }
      return arr;
    }
    let arr = [];
    for (let elt of sexp) {
      let expanded = expandQuasiQuote(elt, evaluator);
      if (expanded instanceof ArrpExpandedValues) {
        let values = expanded.values;
        if (values instanceof Array) {
          values.forEach((val) => {
            arr.push(val)
          });
        } else {
          arr.push(values);
        }
      } else {
        arr.push(expanded);
      }
    }
    return arr;
  } else if (sexp instanceof ArrpComma) {
    if (evaluator.quasiQuoteCounter > evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = ArrpComma.make(expandQuasiQuote(sexp.sexp, evaluator));
      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else if (evaluator.quasiQuoteCounter === evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = evaluator.eval(sexp.sexp);
      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else {
      throw new Error('comma not inside quasi-quote');
    }
  } else if (sexp instanceof ArrpCommaAt) {
    if (evaluator.quasiQuoteCounter > evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = ArrpCommaAt.make(expandQuasiQuote(sexp.sexp, evaluator));
      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else if (evaluator.quasiQuoteCounter === evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = new ArrpExpandedValues(evaluator.eval(sexp.sexp));

      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else {
      throw new Error('comma not inside quasi-quote');
    }
  } else {
    return sexp;
  }
};

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


builtins.set('lambda', new ArrpSpecial((evaluator, paramSexp, ...body) =>　{
  return new ArrpFunction(evaluator.env, paramSexp, body);
}));

builtins.set('defmacro!', new ArrpSpecial((evaluator, sym, params, ...body) =>　{
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

builtins.set('set-g!', new ArrpSpecial((evaluator, sym, val) =>　{
  return evaluator.env.setGlobal(sym, evaluator.eval(val));
}));

builtins.set('delete-g!', new ArrpSpecial((evaluator, sym) =>　{
  return evaluator.env.deleteGlobal(sym);
}));

builtins.set('defun!', new ArrpSpecial((evaluator, sym, paramSexp, ...body) =>　{
  return evaluator.env.setGlobal(sym, new ArrpFunction(evaluator.env, paramSexp, body));
}));

const randomNumeal = (digit) => {
  let ret = '';
  for (let c = 0; c < digit; c++){
    ret += Math.floor(Math.random() * 10);
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
  return evaluator.env.changePkg(evaluator.eval(pkg).toUpperCase());
}));
builtins.set('current-package', new ArrpSpecial((evaluator) =>　{
  return evaluator.env.getPkg();
}));

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
builtins.set('date-time', new ArrpJsMethod('getTime'));
builtins.set('date-year', new ArrpJsMethod('getFullYear'));
builtins.set('date-month', new ArrpJsMethod('getMonth'));
builtins.set('date-date', new ArrpJsMethod('getDate'));
builtins.set('date-day', new ArrpJsMethod('getDay'));
builtins.set('date-hours', new ArrpJsMethod('getHours'));
builtins.set('date-minutes', new ArrpJsMethod('getMinutes'));
builtins.set('date-seconds', new ArrpJsMethod('getSeconds'));
builtins.set('date-milliseconds', new ArrpJsMethod('getMilliseconds'));
builtins.set('date-timezone-offset', new ArrpJsMethod('getTimezoneOffset'));
builtins.set('date-utc-year', new ArrpJsMethod('getUTCFullYear'));
builtins.set('date-utc-month', new ArrpJsMethod('getUTCMonth'));
builtins.set('date-utc-date', new ArrpJsMethod('getUTCDate'));
builtins.set('date-utc-day', new ArrpJsMethod('getUTCDay'));
builtins.set('date-utc-hours', new ArrpJsMethod('getUTCHours'));
builtins.set('date-utc-minutes', new ArrpJsMethod('getUTCMinutes'));
builtins.set('date-utc-seconds', new ArrpJsMethod('getUTCSeconds'));
builtins.set('date-utc-milliseconds', new ArrpJsMethod('getUTCMilliseconds'));

builtins.set('set-date-time!', new ArrpJsMethod('setTime'));
builtins.set('set-date-year!', new ArrpJsMethod('setFullYear'));
builtins.set('set-date-month!', new ArrpJsMethod('setMonth'));
builtins.set('set-date-date!', new ArrpJsMethod('setDate'));
builtins.set('set-date-hours!', new ArrpJsMethod('setHours'));
builtins.set('set-date-minutes!', new ArrpJsMethod('getMinutes'));
builtins.set('set-date-seconds!', new ArrpJsMethod('getSeconds'));
builtins.set('set-date-millisecondes!', new ArrpJsMethod('getMilliseconds'));
builtins.set('set-date-utc-year!', new ArrpJsMethod('setUTCFullYear'));
builtins.set('set-date-utc-month!', new ArrpJsMethod('setUTCMonth'));
builtins.set('set-date-utc-date!', new ArrpJsMethod('setUTCDate'));
builtins.set('set-date-utc-hours!', new ArrpJsMethod('setUTCHours'));
builtins.set('set-date-utc-minutes!', new ArrpJsMethod('setUTCMinutes'));
builtins.set('set-date-utc-seconds!', new ArrpJsMethod('getUTCSeconds'));
builtins.set('set-date-utc-millisecondes!', new ArrpJsMethod('getUTCMilliseconds'));

builtins.set('to-date-string', new ArrpJsMethod('toDateString'));
builtins.set('to-time-string', new ArrpJsMethod('toTimeString'));
builtins.set('to-utc-string', new ArrpJsMethod('toUTCString'));
builtins.set('to-date-iso-string', new ArrpJsMethod('toISOString'));
builtins.set('to-date-json', new ArrpJsMethod('toJSON'));
builtins.set('to-locale-datetime-string', new ArrpJsMethod('toLocaleString'));
builtins.set('to-locale-date-string', new ArrpJsMethod('toLocaleDateString'));
builtins.set('to-locale-time-string', new ArrpJsMethod('toLocaleTimeString'));

// RegExp
builtins.set('regex', (pattern, flags) => RegExp(pattern, flags));
builtins.set('regex-last-index', (regex) => regex.lastIndex);
builtins.set('regex-global?', (regex) => regex.global);
builtins.set('regex-ignoreCase?', (regex) => regex.ignoreCase);
builtins.set('regex-multiline?', (regex) => regex.multiline);
builtins.set('regex-source', (regex) => regex.source);
builtins.set('exec', new ArrpJsMethod('exec'));
builtins.set('test', new ArrpJsMethod('test'));

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

builtins.set('set-into', (arr, ...args) => arr.set.apply(arr, args));
builtins.set('subarray', (arr, ...args) => arr.subarray.apply(arr, args));

// for Array and TypedArray
builtins.set('copy-within!', (arr, ...args) => arr.copyWithin.apply(arr, args));
builtins.set('reverse!', (arr) => arr.reverse());
builtins.set('sort!', (arr) => arr.sort()); // TODO
builtins.set('join', (arr, sep) =>　arr.join(sep));

// Iteration Method for Array and TypedArray
const makeIterationMethod = (name) => {
  return new ArrpSpecial((evaluator, arr, func, ...option) => {
    arr = evaluator.eval(arr);
    func = evaluator.eval(func);
    if (option.length === 0) return arr[name]((...args) => func.call(evaluator, args));
    option = evaluator.eval(option[0]);
    return arr[name]((...args) => func.call(evaluator, args), option);
  });
};

const makeIterationWithPredicateMethod = (name) => {
  return new ArrpSpecial((evaluator, arr, func, ...option) => {
    arr = evaluator.eval(arr);
    func = evaluator.eval(func);
    if (option.length === 0) return arr[name]((...args) => (func.call(evaluator, args) !== false));
    option = evaluator.eval(option[0]);
    return arr[name]((...args) => (func.call(evaluator, args) !== false), option);
  });
};

const bindIterationMethod  = (arrpName, jsName) => builtins.set(arrpName, makeIterationMethod(jsName));
const bindIterationWithPredicateMethod  = (arrpName, jsName) => builtins.set(arrpName, makeIterationWithPredicateMethod(jsName));

bindIterationMethod('for-each', 'forEach');
bindIterationMethod('map', 'map');
bindIterationMethod('reduce', 'reduce');
bindIterationMethod('reduce-right', 'reduceRight');
bindIterationWithPredicateMethod('every', 'every');
bindIterationWithPredicateMethod('some', 'some');
bindIterationWithPredicateMethod('filter', 'filter');
bindIterationWithPredicateMethod('find', 'find');
bindIterationWithPredicateMethod('find-index', 'findIndex');

// String TODO
builtins.set('from-char-code', String.fromCharCode);
builtins.set('from-code-point', String.fromCodePoint);
builtins.set('char-at', (str, ind) => str.charAt(ind));
builtins.set('char-code-at', (str, ind) => str.charCodeAt(ind));
builtins.set('code-point-at', (str, pos) => str.codePointAt(pos));
builtins.set('locale-compare', (str, ...args) => str.localeCompare.apply(str, args));
builtins.set('str-normalize', (str, form) => str.normalize(form));
builtins.set('starts-with', (str, ...args) => str.startsWith.apply(str, args));
builtins.set('ends-with', (str, ...args) => str.endsWith.apply(str, args));
builtins.set('match', (str, regexp) => str.match(regexp));
builtins.set('replace', (str, ...args) => str.replace.apply(str, args)); // TODO
builtins.set('search', (str, regexp) => str.search(regexp));
builtins.set('split', (str, ...args) => str.split.apply(str, args));
builtins.set('substr', (str, ...args) => str.substr.apply(str, args));
builtins.set('substring', (str, ...args) => str.substring.apply(str, args));
builtins.set('to-lower-case', (str) => str.toLowerCase());
builtins.set('to-upper-case', (str) => str.toUpperCase());
builtins.set('to-locale-lower-case', (str, ...args) => str.toLocaleLowerCase.apply(str, args));
builtins.set('to-locale-upper-case', (str, ...args) => str.toLocaleUpperCase.apply(str, args));
builtins.set('trim', (str) => str.trim());
builtins.set('trim-right', (str) => str.trimRight());
builtins.set('trim-left', (str) => str.trimLeft());
builtins.set('pad-end', (str, ...args) => str.padEnd.apply(str, args));
builtins.set('pad-start', (str, ...args) => str.padStart.apply(str, args));
builtins.set('repeat', (str, count) => str.repeat(count));

// ArrayBuffer
builtins.set('array-buffer', (length) => new ArrayBuffer(length));

// for String and Array,
builtins.set('concat', (obj, ...arrs) =>　obj.concat.apply(obj, arrs));

// for String and Array, Typed Array
builtins.set('length', (obj) =>　obj.length);
builtins.set('slice', (obj, ...args) =>　obj.slice.apply(obj, args));
builtins.set('index-of', (obj, ...args) =>　obj.indexOf.apply(obj, args));
builtins.set('last-index-of', (obj, ...args) =>　obj.lastIndexOf.apply(obj, args));

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

builtins.set('get-int-8', (dataview, ...args) =>　dataview.getInt8.apply(dataview, args));
builtins.set('get-uint-8', (dataview, ...args) =>　dataview.getUint8.apply(dataview, args));
builtins.set('get-int-16', (dataview, ...args) =>　dataview.getInt16.apply(dataview, args));
builtins.set('get-uint-16', (dataview, ...args) =>　dataview.getUint16.apply(dataview, args));
builtins.set('get-int-32', (dataview, ...args) =>　dataview.getInt32.apply(dataview, args));
builtins.set('get-uint-32', (dataview, ...args) =>　dataview.getUint32.apply(dataview, args));
builtins.set('get-float-32', (dataview, ...args) =>　dataview.getFloat32.apply(dataview, args));
builtins.set('get-float-64', (dataview, ...args) =>　dataview.getFloat64.apply(dataview, args));

builtins.set('set-int-8!', (dataview, ...args) =>　dataview.setInt8.apply(dataview, args));
builtins.set('set-uint-8!', (dataview, ...args) =>　dataview.setUint8.apply(dataview, args));
builtins.set('set-int-16!', (dataview, ...args) =>　dataview.setInt16.apply(dataview, args));
builtins.set('set-uint-16!', (dataview, ...args) =>　dataview.setUint16.apply(dataview, args));
builtins.set('set-int-32!', (dataview, ...args) =>　dataview.setInt32.apply(dataview, args));
builtins.set('set-uint-32!', (dataview, ...args) =>　dataview.setUint32.apply(dataview, args));
builtins.set('set-float-32!', (dataview, ...args) =>　dataview.setFloat32.apply(dataview, args));
builtins.set('set-float-64!', (dataview, ...args) =>　dataview.setFloat64.apply(dataview, args));

// Map
builtins.set('make-map', (arg) => new Map(arg));
builtins.set('clear-map!', (map) => map.clear());
builtins.set('delete-value!', (map, key) => map.delete(key));
builtins.set('get-value', (map, key) => map.get(key));
builtins.set('has-key', (map, key) => map.has(key));
builtins.set('set-value!', (map, key, value) => map.set(key, value));

// Set
builtins.set('make-set', (arg) => new Set(arg));
builtins.set('add-member!', (set, val) => set.add(val));
builtins.set('clear-set!', (set) => set.clear());
builtins.set('delete-member!', (set, value) => set.delete(value));
builtins.set('has-member', (set, value) => set.has(value));

// size of Map, Set
builtins.set('size-of', (mapOrSet) => mapOrSet.size);


// JSON
builtins.set('json-parse', (str) =>　JSON.parse(str)); // TODO
builtins.set('json-stringify', (val) =>　JSON.stringify(val)); //TODO

// Intl
builtins.set('intl-collator', (...args) => Intl.Collator.apply(null,args));
builtins.set('intl-collator-supported-locales-of', (...args) => Intl.Collator.supportedLocalesOf.apply(null,args));
builtins.set('compare', (col, ...args) => col.compare.apply(col, args));

builtins.set('intl-datetime-format', (...args) => Intl.DateTimeFormat.apply(null,args));
builtins.set('intl-datetime-format-supported-locales-of', (...args) => Intl.DateTimeFormat.supportedLocalesOf.apply(null,args));
builtins.set('format-to-parts', (intldtf, ...args) => intldtf.formatToParts.apply(null,args));

builtins.set('intl-number-format', (...args) => Intl.NumberFormat.apply(null,args));
builtins.set('intl-number-format-supported-locales-of', (...args) => Intl.NumberFormat.supportedLocalesOf.apply(null,args));

builtins.set('intl-format', (intldtnf, ...args) => intldtnf.format.apply(intldtnf, args)); // DateTime and Number
builtins.set('resolved-options', (intl) => intl.resolvedOptions());

// EXPORTS
module.exports = builtins;
