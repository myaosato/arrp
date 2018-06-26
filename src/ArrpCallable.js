'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
class ArrpCallable {

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
    let innerEnv = new Map();
    let argInd = 0;
    for (let ind in this.params) {
      let param = this.params[ind];
      if (param instanceof ArrpSymbol && param.identifier === '&rest') {
        innerEnv.set(this.params[Number(ind) + 1].identifier, args.slice(argInd));
        env.lexicalEnvs.push(innerEnv);
        return;
      } else if (param instanceof ArrpSymbol){
        innerEnv.set(param.identifier, args[argInd]);
        argInd++;
      }
    }
    env.lexicalEnvs.push(innerEnv);
  }

}

module.exports = ArrpCallable;
