'use strict';
const arrpPrint = require(__dirname + '/arrp-print.js');
class ArrpMultipleValue {
  constructor(...values) {
    this.values = values;
  }

  top() {
    return this.values[0];
  }

  toString() {
    return this.values.map((elt) => arrpPrint(elt)).join('\n');
  }

  inspect() {
    return this.toString();
  }

}
module.exports = ArrpMultipleValue;
