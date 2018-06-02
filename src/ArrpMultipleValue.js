'use strict';
class ArrpMultipleValue {
  constructor(...values) {
    this.values = values;
  }

  top() {
    return this.values[0];
  }

  toString() {
    return this.values.map((elt) => String(elt)).join('\n');
  }

  inspect() {
    return this.toString();
  }

}
module.exports = ArrpMultipleValue;
