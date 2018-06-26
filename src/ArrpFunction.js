'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpCallable = require(__dirname + '/ArrpCallable.js');
const ReturnFromFunctionError = require(__dirname + '/ReturnFromFunctionError.js');

class ArrpFunction extends ArrpCallable{
  constructor (env, paramSexp, body) {
    super();
    this.env = env.getLexicalEnvs();
    this.params = this.__setParams(paramSexp);
    body.unshift(ArrpSymbol.make('progn'));
    this.body = body;
  }

  call(evaluator, args) {
    evaluator.env.enter(this.env);
    this.bind(evaluator.env, args);
    let result;
    try {
      result = evaluator.eval(this.body);
      evaluator.env.exit();
    } catch (error) {
      if (error instanceof ReturnFromFunctionError) {
        return error.val;
      }
      throw error;
    }
    return result;
  }

  toString() {
    return '#<Arrp Function>';
  }

  inspect() {
    return this.toString();
  }
}

module.exports = ArrpFunction;
