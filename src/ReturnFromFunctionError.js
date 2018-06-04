'use strict';
class ReturnFromFunctionError extends Error {
  constructor(val){
    super('return with value');
    this.val = val;
  }
}
module.exports = ReturnFromFunctionError;
