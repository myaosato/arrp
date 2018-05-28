'use strict';

class ArrpSexpStack {
  constructor(sexps) {
    this.stack = sexps;
  }

  dequeue() {
    return this.stack.shift();
  }
}

module.exports = ArrpSexpStack;
