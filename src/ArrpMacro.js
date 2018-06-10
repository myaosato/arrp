'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
class ArrpMacro {
  constructor (env, paramSexp, body) {
    this.env = env.getLexialEnv();
    this.params = this.__setParams(paramSexp);
    body.unshift(ArrpSymbol.make('progn'));
    this.body = body;
  }

  __setParams(paramSexp) {
    let params = [];
    for (let ind in paramSexp) {
      let param = paramSexp[ind];
      if (param instanceof ArrpSymbol) {
        if (param.identifier === '&rest') {
          if (paramSexp[ind + 1] instanceof ArrpSymbol) {
            params.push(param);
            params.push(paramSexp[ind + 1]);
            return params;
          }
        }
        params.push(param);
      } else {
        throw Error('invalid parameters');
      }
    }
    return params;
  }

  bind (env, args) {
    let argInd = 0;
    for (let ind in this.params) {
      let param = this.params[ind];
      if (param instanceof ArrpSymbol && param.identifier === '&rest') {
        env.set(this.params[Number(ind) + 1], args.slice(argInd));
        return;
      } else if (param instanceof ArrpSymbol){
        env.set(param, args[argInd]);
        argInd++;
      }
    }
  }

  expand(evaluator, args) {
    evaluator.env.enter(this.env);
    this.bind(evaluator.env, args);
    let result = evaluator.eval(this.body);
    evaluator.env.exit();
    return result;
  }


}

module.exports = ArrpMacro;
