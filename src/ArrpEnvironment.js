'use strict';
class ArrpEnvironment {
  constructor (globalEnv) {
    this.globalEnv = globalEnv;
    this.lexicalEnv = new Map();
    this.lexicalEnvStack = [];
  }

  get (sym) {
    let key = sym.identifier;
    if (this.lexicalEnvStack.length === 0) return this.getGlobal(sym);
    if (this.lexicalEnv.has(key)) return this.lexicalEnv.get(key);
    return this.getGlobal(sym);
  }

  getGlobal (sym) {
    let key = sym.identifier;
    if (this.globalEnv.has(key)) return this.globalEnv.get(key);
    return null; // TODO Error
  }

  set (sym, val) {
    if (this.lexicalEnvStack.length === 0) return this.setGlobal(sym, val);
    this.lexicalEnv.set(sym.identifier, val);
    return val;
  }

  setGlobal (sym, val) {
    this.globalEnv.set(sym.identifier, val);
    return val;
  }

  enter(env) {
    this.lexicalEnvStack.push(this.lexicalEnv);
    this.lexicalEnv = env;
  }

  exit() {
    this.lexicalEnv = this.lexicalEnvStack.pop();
  }

  getLexialEnv() {
    return this.lexicalEnv;
  }

}

module.exports = ArrpEnvironment;
