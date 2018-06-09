'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpComma = require(__dirname + '/ArrpComma.js');
const ArrpCommaAt = require(__dirname + '/ArrpCommaAt.js');
const ArrpReader = require(__dirname + '/ArrpReader.js');

const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
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


builtins.set('lambda', new ArrpSpecial((evaluator, params, ...body) =>　{
  return new ArrpFunction(evaluator.env, params, body);
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

builtins.set('defun!', new ArrpSpecial((evaluator, sym, params, ...body) =>　{
  return evaluator.env.setGlobal(sym, new ArrpFunction(evaluator.env, params, body));
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

// Eval
builtins.set('eval', new ArrpSpecial((evaluator, sexp) =>　{
  return evaluator.eval(evaluator.eval(sexp));
}));

// Return
builtins.set('return', ((val) =>　{
  throw new ReturnFromFunctionError(val);
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

// Arithemetic　
builtins.set('+', (...numbers) =>　numbers.reduce((prev, curr) => prev + curr));
builtins.set('-', (top, ...numbers) => numbers.length === 0? - top: top - numbers.reduce((prev, curr) => prev + curr));
builtins.set('*', (...numbers) =>　numbers.reduce((prev, curr) => prev * curr));
builtins.set('/', (top, ...numbers) => numbers.length === 0? 1 / top: top / numbers.reduce((prev, curr) => prev * curr));
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
builtins.set('date-time', (date) => date.getTime());
builtins.set('date-year', (date) => date.getFullYear());
builtins.set('date-month', (date) => date.getMonth() + 1);
builtins.set('date-date', (date) => date.getDate());
builtins.set('date-day', (date) => date.getDay());
builtins.set('date-hours', (date) => date.getHours());
builtins.set('date-minutes', (date) => date.getMinutes());
builtins.set('date-seconds', (date) => date.getSeconds());
builtins.set('date-milliseconds', (date) => date.getMilliseconds());
builtins.set('date-timezone-offset', (date) => date.getTimezoneOffset());
builtins.set('date-utc-year', (date) => date.getUTCFullYear());
builtins.set('date-utc-month', (date) => date.getUTCMonth() + 1);
builtins.set('date-utc-date', (date) => date.getUTCDate());
builtins.set('date-utc-day', (date) => date.getUTCDay());
builtins.set('date-utc-hours', (date) => date.getUTCHours());
builtins.set('date-utc-minutes', (date) => date.getUTCMinutes());
builtins.set('date-utc-seconds', (date) => date.getUTCSeconds());
builtins.set('date-utc-milliseconds', (date) => date.getUTCMilliseconds());

builtins.set('set-date-time!', (date, time) => date.setTime(time));
builtins.set('set-date-year!', (date, year) => date.setFullYear(year));
builtins.set('set-date-month!', (date, month1) => date.setMonth(month1 - 1));
builtins.set('set-date-date!', (date, dateVal) => date.setDate(dateVal));
builtins.set('set-date-hours!', (date, hours) => date.setHours(hours));
builtins.set('set-date-minutes!', (date, minute) => date.getMinutes(minutes));
builtins.set('set-date-seconds!', (date, seconds) => date.getSeconds(seconds));
builtins.set('set-date-millisecondes!', (date, milliseconds) => date.getMilliseconds(milliseconds));
builtins.set('set-date-utc-year!', (date, year) => date.setUTCFullYear(year));
builtins.set('set-date-utc-month!', (date, month1) => date.setUTCMonth(month - 1));
builtins.set('set-date-utc-date!', (date, dateVal) => date.setUTCDate(dateVal));
builtins.set('set-date-utc-hours!', (date, hours) => date.setUTCHours(hours));
builtins.set('set-date-utc-minutes!', (date, minute) => date.getUTCMinutes(minutes));
builtins.set('set-date-utc-seconds!', (date, seconds) => date.getUTCSeconds(seconds));
builtins.set('set-date-utc-millisecondes!', (date, milliseconds) => date.getUTCMilliseconds(milliseconds));

builtins.set('to-date-string', (date) => date.toDateString());
builtins.set('to-time-string', (date) => date.toTimeString());
builtins.set('to-utc-string', (date) => date.toUTCString());
builtins.set('to-date-iso-string', (date) => date.toISOString());
builtins.set('to-date-json', (date) => date.toJSON());
builtins.set('to-locale-datetime-string', (date, locales, options) => date.toLocaleString(locales, options));
builtins.set('to-locale-date-string', (date, locales, options) => date.toLocaleDateString(locales, options));
builtins.set('to-locale-time-string', (date, locales, options) => date.toLocaleTimeString(locales, options));

// RegExp
builtins.set('regex', (pattern, flags) => RegExp(pattern, flags));
builtins.set('regex-last-index', (regex) => regex.lastIndex);
builtins.set('regex-global?', (regex) => regex.global);
builtins.set('regex-ignoreCase?', (regex) => regex.ignoreCase);
builtins.set('regex-multiline?', (regex) => regex.multiline);
builtins.set('regex-source', (regex) => regex.source);
builtins.set('exec', (regex, target) => regex.exec(target));
builtins.set('test', (regex, target) => regex.test(target));


// String TODO
builtins.set('char-code', String.fromCharCode);

// Array
builtins.set('array', (...vals) =>　Array.from(vals));
builtins.set('nth', (arr, ind) =>　arr[ind]);
builtins.set('first', (arr) =>　arr[0]);
builtins.set('rest', (arr) =>　arr.slice(1));
builtins.set('concat', (arr, ...arrs) =>　arr.concat.apply(arr, arrs));

builtins.set('replace-nth!', (arr, ind, val) =>　{
  arr[ind] = val;
  return val;
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

builtins.set('reduce', new ArrpSpecial((evaluator, arr, func, init) => {
  arr = evaluator.eval(arr);
  func = evaluator.eval(func);
  init = evaluator.eval(init);
  return arr.reduce((...args) => {
    return evaluator.eval(([func]).concat(args));
  }, init);
}));

// EXPORTS
module.exports = builtins;
