'use strict';

class ArrpExpandedValues {
  constructor(values) {
    this.values = values;
  }

  toString() {
    if (this.values instanceof Array) {
      return '<Expanded: ' + this.values.join(' ') + '>'; // TODO
    }
    return '<Expanded: ' + this.values + '>'; // TODO
  }
  inspect() {
    return this.toString();
  }
}

module.exports = ArrpExpandedValues;
