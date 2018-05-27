'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');

const ArrpEnvironment = require(__dirname + '/ArrpEnvironment.js');

const env = new ArrpEnvironment(require(__dirname + '/arrp-builtins.js'));

const call = (op, args) => {
  if (op instanceof Function) {
    return op.apply(null, args.map(arrpEval));
  } else if (op instanceof ArrpSpecial) {
    return op.call(env, arrpEval, args);
  } else if (op instanceof ArrpFunction) {
    return op.call(env, arrpEval, args.map(arrpEval));
  } else if (op instanceof ArrpMacro) {
    return; // TODO WIP
  }
  return null; // TODO Error
}

const arrpEval = (sexp) => {
  if (typeof sexp === 'string' || typeof sexp === 'number') {
    return sexp;
  } else if (sexp === undefined || sexp === null) {
    return sexp;
  } else if (sexp instanceof Boolean) {
    return sexp;
  } else if (sexp === Infinity) {
    return sexp;
  } else if (sexp instanceof ArrpSymbol) {
    return env.get(sexp);
  } else if (sexp instanceof Array) {
    if (sexp.length === 0) {
      return sexp;
    } else {
      return call(arrpEval(sexp[0]), sexp.slice(1));
    }
  }
  return sexp;
};

const evalFromStack = (sexps) => {
  let tmp = undefined; // TODO
  while (true) {
    let sexp = sexps.pop();
    if (sexp === undefined) break;
    tmp = arrpEval(sexp);
  }
  return tmp;
}

module.exports = {
  arrpEval: arrpEval,
  evalFromStack: evalFromStack
};
