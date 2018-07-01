'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpComma = require(__dirname + '/ArrpComma.js');
const ArrpCommaAt = require(__dirname + '/ArrpCommaAt.js');
const ArrpExpandedValues = require(__dirname + '/ArrpExpandedValues.js');

let expandQuasiQuote = (sexp, evaluator) => {
  if (sexp instanceof Array) {
    if (sexp[0] instanceof ArrpSymbol && sexp[0].identifier === 'quasi-quote'){
      evaluator.quasiQuoteCounter++;
      let arr;
      try {
        arr = [sexp[0], expandQuasiQuote(sexp[1], evaluator)];
      } catch (e) {
        throw e;
      } finally {
        evaluator.quasiQuoteCounter--;
      }
      return arr;
    }
    let arr = [];
    for (let elt of sexp) {
      let expanded = expandQuasiQuote(elt, evaluator);
      if (expanded instanceof ArrpExpandedValues) {
        let values = expanded.values;
        if (values instanceof Array) {
          values.forEach((val) => {
            arr.push(val)
          });
        } else {
          arr.push(values);
        }
      } else {
        arr.push(expanded);
      }
    }
    return arr;
  } else if (sexp instanceof ArrpComma) {
    if (evaluator.quasiQuoteCounter > evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = ArrpComma.make(expandQuasiQuote(sexp.sexp, evaluator));
      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else if (evaluator.quasiQuoteCounter === evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = evaluator.eval(sexp.sexp);
      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else {
      throw new Error('comma not inside quasi-quote');
    }
  } else if (sexp instanceof ArrpCommaAt) {
    if (evaluator.quasiQuoteCounter > evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = ArrpCommaAt.make(expandQuasiQuote(sexp.sexp, evaluator));
      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else if (evaluator.quasiQuoteCounter === evaluator.commaCounter + 1) {
      evaluator.commaCounter++;
      let val;
      try{
        val = new ArrpExpandedValues(evaluator.eval(sexp.sexp));

      } catch (e){
        throw e;
      } finally {
        evaluator.commaCounter--;
      }
      return val;
    } else {
      throw new Error('comma not inside quasi-quote');
    }
  } else {
    return sexp;
  }
};
module.exports = expandQuasiQuote;
