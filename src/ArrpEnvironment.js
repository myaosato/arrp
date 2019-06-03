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

  // package
  changePkg (pkg) {
      if (typeof pkg === 'string') this.package = pkg;
      return this.package;
  }

  getPkg () {
      return this.package;
  }

  __getKey(sym) {
    if (typeof sym.identifier === 'symbol') return sym;
    if (sym.identifier.indexOf(':') === -1){
      return this.package + ':' + sym.identifier;
    } else {
      let sepInd = sym.identifier.indexOf(':');
      let key = sym.identifier.slice(0, sepInd).toUpperCase() + sym.identifier.slice(sepInd)
      return key;
    }
  }

  // access (get)
  get (sym) {
    if (this.lexicalEnvsStack.length === 0) return this.getGlobal(sym);
    if (this.hasLex(sym)) return this.getLex(sym);
    return this.getGlobal(sym);
  }

  hasLex(sym) {
    let key = this.__getKey(sym);
    let len = this.lexicalEnvs.length;
    for (let ind = len - 1; ind >= 0; ind--){
      if (this.lexicalEnvs[ind].has(key)) return true;
    }
    return false;
  }

  getLex(sym) {
    let key = this.__getKey(sym);
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
    let key = sym.name();
    if (this.__builtins.has(key)) return this.__builtins.get(key);
    return undefined;
  }


  // access (set)
  set (sym, val) {
    if (this.lexicalEnvsStack.length === 0 || this.lexicalEnvs.length === 0) return this.setGlobal(sym, val);
    return this.setLex(sym, val);
  }

  setLex(sym, val) {
    let key = this.__getKey(sym);
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

  // scope
  enter(envs) {
    this.lexicalEnvsStack.push(this.lexicalEnvs);
    this.lexicalEnvs = envs.slice(); // Shallow copy for not modifying property of ArrpFunction.
  }

  exit() {
    if (this.lexicalEnvsStack.length === 0) {
      this.lexicalEnvs = [];
      return;
    }
    this.lexicalEnvs = this.lexicalEnvsStack.pop();
  }

  // getter
  getLexicalEnvs() {
    return this.lexicalEnvs;
  }

}

module.exports = ArrpEnvironment;
