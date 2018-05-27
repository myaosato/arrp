'use strict';

class ArrpSexpStack {
  constructor(sexps) {
    this.stack = sexps;
  }

  pop() {
    return this.stack.pop();
  }
}

module.exports = ArrpSexpStack;
