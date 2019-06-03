const ArrpEnvironment = require(__dirname + '/src/ArrpEnvironment.js');
const ArrpEval = require(__dirname + '/src/ArrpEvaluator.js');
const ArrpReader = require(__dirname + '/src/ArrpReader.js');
const arrpPrint = require(__dirname + '/src/arrp-print.js');
class ARRP {
  constructor(...optionalBuiltins){
    this.ae = new ArrpEval(new ArrpEnvironment(optionalBuiltins));
    this.ar = new ArrpReader(() => this.getPkg());
  }

  read(str){
    return this.ar.read(str);
  }

  evalFromStack(stack) {
    return this.ae.evalFromStack(stack);
  }

  eval(sexp) {
    return this.ae.eval(sexp);
  }

  print(sexp) {
    return arrpPrint(sexp);
  }

  getPkg() {
    return this.ae.env.getPkg();
  }

  resetReader() {
    this.ar = new ArrpReader(() => this.getPkg());
  }
}

module.exports = ARRP;
