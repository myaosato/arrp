'use strict';
class ReturnFromFunctionError extends Error {
  constructor(sexp, envs){
    super('return with value');
    this.sexp = sexp;
    this.envs = envs;
  }
}
module.exports = ReturnFromFunctionError;
