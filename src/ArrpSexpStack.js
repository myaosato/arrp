'use strict';

class ArrpSexpStack {
  constructor(sexps, pos) {
    this.stack = sexps;
    this.__num = pos + 1;
  }

  dequeue() {
    return this.stack.shift();
  }

  getNum() {
    return this.__num;
  }
}

module.exports = ArrpSexpStack;
