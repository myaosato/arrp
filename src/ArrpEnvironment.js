'use strict';
const builtins = require(__dirname + '/arrp-builtins.js');
class ArrpEnvironment {
  constructor (globalEnv) {
    this.__builtins = builtins;
    this.globalEnv = globalEnv;
    this.lexicalEnv = new Map();
    this.lexicalEnvStack = [];
    this.package = 'ARRP-USER';
  }

  changePkg (pkg) {
      if (typeof pkg === 'string') this.package = pkg;
      return this.package;
  }

  getPkg () {
      return this.package;
  }

  __getKey(sym) {
    if (sym.identifier.indexOf(':') === -1){
      return this.package + ':' + sym.identifier;
    } else {
      let sepInd = sym.identifier.indexOf(':');
      let key = sym.identifier.slice(0, sepInd).toUpperCase() + sym.identifier.slice(sepInd)
      return key;
    }
  }

  get (sym) {
    if (this.lexicalEnvStack.length === 0) return this.getGlobal(sym);
    let key = sym.identifier;
    if (this.lexicalEnv.has(key)) return this.lexicalEnv.get(key);
    return this.getGlobal(sym);
  }

  getGlobal (sym) {
    let key = this.__getKey(sym);
    if (this.globalEnv.has(key)) return this.globalEnv.get(key);
    return this.getBuiltin(sym);
  }

  getBuiltin (sym) {
    let key = sym.identifier;
    if (this.__builtins.has(key)) return this.__builtins.get(key);
    return null; // TODO Error
  }

  set (sym, val) {
    if (this.lexicalEnvStack.length === 0) return this.setGlobal(sym, val);
    this.lexicalEnv.set(sym.identifier, val);
    return val;
  }

  setGlobal (sym, val) {
    this.globalEnv.set(this.__getKey(sym), val);
    return val;
  }

  deleteGlobal (sym) {
    this.globalEnv.delete(this.__getKey(sym));
    return sym;
  }


  enter(env) {
    this.lexicalEnvStack.push(this.lexicalEnv);
    this.lexicalEnv = env;
  }

  exit() {
    if(this.lexicalEnvStack.length === 1) {
      this.lexicalEnv = new Map();
      this.lexicalEnvStack.pop();
    } else {
      this.lexicalEnv = this.lexicalEnvStack.pop();
    }
  }

  getLexialEnv() {
    return this.lexicalEnv;
  }

}

module.exports = ArrpEnvironment;
