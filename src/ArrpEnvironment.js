'use strict';
const builtins = require(__dirname + '/arrp-builtins.js');
class ArrpEnvironment {
  constructor (optionalBuiltins) {
    this.__builtins = builtins;
    optionalBuiltins.forEach((map) => {
      map.forEach((val, key) => {
        this.__builtins.set(key, val);
      });
    });
    this.globalEnv = new Map();
    this.lexicalEnvs = [];
    this.lexicalEnvsStack = [];
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
    if (this.lexicalEnvsStack.length === 0) return this.getGlobal(sym);
    let key = sym.identifier;
    if (this.hasLex(key)) return this.getLex(key);
    return this.getGlobal(sym);
  }

  hasLex(key) {
    let len = this.lexicalEnvs.length;
    for (let ind = len - 1; ind >= 0; ind--){
      if (this.lexicalEnvs[ind].has(key)) return true;
    }
    return false;
  }

  getLex(key) {
    let len = this.lexicalEnvs.length;
    for (let ind = len - 1; ind >= 0; ind--){
      if (this.lexicalEnvs[ind].has(key)) return this.lexicalEnvs[ind].get(key);
    }
    return undefined;
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
    if (this.lexicalEnvsStack.length === 0 || this.lexicalEnvs.length === 0) return this.setGlobal(sym, val);
    this.setLex(sym.identifier, val);
    return val;
  }

  setLex(key, val) {
    let len = this.lexicalEnvs.length;
    for (let ind = len - 1; ind >= 0; ind--){
      if (this.lexicalEnvs[ind].has(key)) {
        this.lexicalEnvs[ind].set(key, val);
        return val;
      }
    }
    this.lexicalEnvs[len - 1].set(key, val);
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
    this.lexicalEnvsStack.push(this.lexicalEnvs);
    this.lexicalEnvs = env.slice();
  }

  exit() {
      this.lexicalEnvs = this.lexicalEnvsStack.pop();
  }

  getLexicalEnvs() {
    return this.lexicalEnvs;
  }

}

module.exports = ArrpEnvironment;
