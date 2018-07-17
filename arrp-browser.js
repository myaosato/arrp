/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./arrp-browser-interface.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./arrp-browser-interface.js":
/*!***********************************!*\
  !*** ./arrp-browser-interface.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ARRP = __webpack_require__(/*! ./arrp.js */ \"./arrp.js\");\nconst arrp = new ARRP();\nlet codes = document.querySelectorAll('script[type=\"text/arrp\"]');\nfor (let ind = 0; ind < codes.length; ind++) {\n  console.log(arrp.evalFromStack(arrp.read(codes[ind].innerHTML)));\n}\n\n\n//# sourceURL=webpack:///./arrp-browser-interface.js?");

/***/ }),

/***/ "./arrp.js":
/*!*****************!*\
  !*** ./arrp.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const ArrpEnvironment = __webpack_require__(/*! ./src/ArrpEnvironment.js */ \"./src/ArrpEnvironment.js\");\nconst ArrpEval = __webpack_require__(/*! ./src/ArrpEvaluator.js */ \"./src/ArrpEvaluator.js\");\nconst ArrpReader = __webpack_require__(/*! ./src/ArrpReader.js */ \"./src/ArrpReader.js\");\nconst arrpPrint = __webpack_require__(/*! ./src/arrp-print.js */ \"./src/arrp-print.js\");\nclass ARRP {\n  constructor(...optionalBuiltins){\n    this.ar = new ArrpReader();\n    this.ae = new ArrpEval(new ArrpEnvironment(optionalBuiltins));\n  }\n\n  read(str){\n    return this.ar.read(str);\n  }\n\n  evalFromStack(stack) {\n    return this.ae.evalFromStack(stack);\n  }\n\n  eval(sexp) {\n    return this.ae.eval(sexp);\n  }\n\n  print(sexp) {\n    return arrpPrint(sexp);\n  }\n\n  getPkg() {\n    return this.ae.env.getPkg();\n  }\n\n  resetReader() {\n    this.ar = new ArrpReader();\n  }\n}\n\nmodule.exports = ARRP;\n\n\n//# sourceURL=webpack:///./arrp.js?");

/***/ }),

/***/ "./src/ArrpCallable.js":
/*!*****************************!*\
  !*** ./src/ArrpCallable.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nclass ArrpCallable {\n\n  __setParams(paramSexp) {\n    let params = [];\n    for (let ind in paramSexp) {\n      let param = paramSexp[ind];\n      if (param instanceof ArrpSymbol) {\n        if (param.identifier === '&rest') {\n          if (paramSexp[ind + 1] instanceof ArrpSymbol) {\n            params.push(param);\n            params.push(paramSexp[ind + 1]);\n            return params;\n          }\n        }\n        params.push(param);\n      } else {\n        throw Error('invalid parameters');\n      }\n    }\n    return params;\n  }\n\n  bind (env, args) {\n    let innerEnv = new Map();\n    let argInd = 0;\n    for (let ind in this.params) {\n      let param = this.params[ind];\n      if (param instanceof ArrpSymbol && param.identifier === '&rest') {\n        innerEnv.set(this.params[Number(ind) + 1].identifier, args.slice(argInd));\n        env.lexicalEnvs.push(innerEnv);\n        return;\n      } else if (param instanceof ArrpSymbol){\n        innerEnv.set(param.identifier, args[argInd]);\n        argInd++;\n      }\n    }\n    env.lexicalEnvs.push(innerEnv);\n  }\n\n}\n\nmodule.exports = ArrpCallable;\n\n\n//# sourceURL=webpack:///./src/ArrpCallable.js?");

/***/ }),

/***/ "./src/ArrpComma.js":
/*!**************************!*\
  !*** ./src/ArrpComma.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpExpandedValues = __webpack_require__(/*! ./src/ArrpExpandedValues.js */ \"./src/ArrpExpandedValues.js\");\nconst arrpPrint = __webpack_require__(/*! ./src/arrp-print.js */ \"./src/arrp-print.js\");\nclass ArrpComma {\n  constructor(sexp) {\n    this.sexp = sexp;\n  }\n\n  toString() {\n    return ',' + arrpPrint(this.sexp);\n  }\n  inspect() {\n    return this.toString();\n  }\n\n  static make(sexp) {\n    if (sexp instanceof ArrpExpandedValues) {\n      return new ArrpExpandedValues(sexp.values.map((val) =>  new ArrpComma(val)));\n    }\n    return new ArrpComma(sexp);\n  }\n}\n\nmodule.exports = ArrpComma;\n\n\n//# sourceURL=webpack:///./src/ArrpComma.js?");

/***/ }),

/***/ "./src/ArrpCommaAt.js":
/*!****************************!*\
  !*** ./src/ArrpCommaAt.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpExpandedValues = __webpack_require__(/*! ./src/ArrpExpandedValues.js */ \"./src/ArrpExpandedValues.js\");\nconst arrpPrint = __webpack_require__(/*! ./src/arrp-print.js */ \"./src/arrp-print.js\");\nclass ArrpCommaAt {\n  constructor(sexp) {\n    this.sexp = sexp;\n  }\n\n  toString() {\n    return ',@' + arrpPrint(this.sexp);\n  }\n  inspect() {\n    return this.toString();\n  }\n\n  static make(sexp) {\n    if (sexp instanceof ArrpExpandedValues) {\n      return new ArrpExpandedValues(sexp.values.map((val) =>  new ArrpCommaAt(val)));\n    }\n    return new ArrpCommaAt(sexp);\n\n  }\n}\n\nmodule.exports = ArrpCommaAt;\n\n\n//# sourceURL=webpack:///./src/ArrpCommaAt.js?");

/***/ }),

/***/ "./src/ArrpEnvironment.js":
/*!********************************!*\
  !*** ./src/ArrpEnvironment.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst builtins = __webpack_require__(/*! ./src/arrp-builtins.js */ \"./src/arrp-builtins.js\");\nclass ArrpEnvironment {\n  constructor (optionalBuiltins) {\n    this.__builtins = builtins;\n    optionalBuiltins.forEach((map) => {\n      map.forEach((val, key) => {\n        this.__builtins.set(key, val);\n      });\n    });\n    this.globalEnv = new Map();\n    this.lexicalEnvs = [];\n    this.lexicalEnvsStack = [];\n    this.package = 'ARRP-USER';\n  }\n\n  // package\n  changePkg (pkg) {\n      if (typeof pkg === 'string') this.package = pkg;\n      return this.package;\n  }\n\n  getPkg () {\n      return this.package;\n  }\n\n  __getKey(sym) {\n    if (typeof sym.identifier === 'symbol') return sym;\n    if (sym.identifier.indexOf(':') === -1){\n      return this.package + ':' + sym.identifier;\n    } else {\n      let sepInd = sym.identifier.indexOf(':');\n      let key = sym.identifier.slice(0, sepInd).toUpperCase() + sym.identifier.slice(sepInd)\n      return key;\n    }\n  }\n\n  // access (get)\n  get (sym) {\n    if (this.lexicalEnvsStack.length === 0) return this.getGlobal(sym);\n    if (this.hasLex(sym)) return this.getLex(sym);\n    return this.getGlobal(sym);\n  }\n\n  hasLex(sym) {\n    let key = sym.identifier;\n    let len = this.lexicalEnvs.length;\n    for (let ind = len - 1; ind >= 0; ind--){\n      if (this.lexicalEnvs[ind].has(key)) return true;\n    }\n    return false;\n  }\n\n  getLex(sym) {\n    let key = sym.identifier;\n    let len = this.lexicalEnvs.length;\n    for (let ind = len - 1; ind >= 0; ind--){\n      if (this.lexicalEnvs[ind].has(key)) return this.lexicalEnvs[ind].get(key);\n    }\n    return undefined;\n  }\n\n\n  getGlobal (sym) {\n    let key = this.__getKey(sym);\n    if (this.globalEnv.has(key)) return this.globalEnv.get(key);\n    return this.getBuiltin(sym);\n  }\n\n  getBuiltin (sym) {\n    let key = sym.identifier;\n    if (this.__builtins.has(key)) return this.__builtins.get(key);\n    return undefined;\n  }\n\n\n  // access (set)\n  set (sym, val) {\n    if (this.lexicalEnvsStack.length === 0 || this.lexicalEnvs.length === 0) return this.setGlobal(sym, val);\n    return this.setLex(sym, val);\n  }\n\n  setLex(sym, val) {\n    let key = sym.identifier;\n    let len = this.lexicalEnvs.length;\n    for (let ind = len - 1; ind >= 0; ind--){\n      if (this.lexicalEnvs[ind].has(key)) {\n        this.lexicalEnvs[ind].set(key, val);\n        return val;\n      }\n    }\n    this.lexicalEnvs[len - 1].set(key, val);\n    return val;\n  }\n\n\n  setGlobal (sym, val) {\n    this.globalEnv.set(this.__getKey(sym), val);\n    return val;\n  }\n\n  deleteGlobal (sym) {\n    this.globalEnv.delete(this.__getKey(sym));\n    return sym;\n  }\n\n  // scope\n  enter(envs) {\n    this.lexicalEnvsStack.push(this.lexicalEnvs);\n    this.lexicalEnvs = envs.slice(); // Shallow copy for not modifying property of ArrpFunction.\n  }\n\n  exit() {\n      if (this.lexicalEnvsStack.length === 0) {\n        this.lexicalEnvs = [];\n        return;\n      }\n      this.lexicalEnvs = this.lexicalEnvsStack.pop();\n  }\n\n  // getter\n  getLexicalEnvs() {\n    return this.lexicalEnvs;\n  }\n\n}\n\nmodule.exports = ArrpEnvironment;\n\n\n//# sourceURL=webpack:///./src/ArrpEnvironment.js?");

/***/ }),

/***/ "./src/ArrpEvaluator.js":
/*!******************************!*\
  !*** ./src/ArrpEvaluator.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nconst ArrpComma = __webpack_require__(/*! ./src/ArrpComma.js */ \"./src/ArrpComma.js\");\nconst ArrpFunction = __webpack_require__(/*! ./src/ArrpFunction.js */ \"./src/ArrpFunction.js\");\nconst ArrpMacro = __webpack_require__(/*! ./src/ArrpMacro.js */ \"./src/ArrpMacro.js\");\nconst ArrpSpecial = __webpack_require__(/*! ./src/ArrpSpecial.js */ \"./src/ArrpSpecial.js\");\nconst ArrpJsMethod = __webpack_require__(/*! ./src/ArrpJsMethod.js */ \"./src/ArrpJsMethod.js\");\nconst ReturnFromFunctionError = __webpack_require__(/*! ./src/ReturnFromFunctionError.js */ \"./src/ReturnFromFunctionError.js\");\nconst ArrpMultipleValue = __webpack_require__(/*! ./src/ArrpMultipleValue.js */ \"./src/ArrpMultipleValue.js\");\n\n\nclass ArrpEvaluator{\n  constructor(env) {\n      this.env = env;\n      this.quasiQuoteCounter = 0;\n      this.commaCounter = 0;\n      this.envsForTco = null;\n      this.sexpForTco = null;\n  }\n\n  __getSingleValue(val){\n    if (val instanceof ArrpMultipleValue) return val.top();\n    return val;\n  }\n\n  call(op, args) {\n    while (true) {\n      if (op instanceof Function) {\n        return op.apply(null, args.map((arg) => this.__getSingleValue(this.eval(arg))));\n      } else if (op instanceof ArrpJsMethod) {\n        let a = args.map((arg) => this.__getSingleValue(this.eval(arg)));\n        return a[0][op.identifier].apply(a[0], a.slice(1));\n      } else if (op instanceof ArrpSpecial) {\n        return op.call(this, args);\n      } else if (op instanceof ArrpFunction) {\n        try {\n          if (this.envsForTco === null) {\n            return op.call(this, args.map((arg) => this.__getSingleValue(this.eval(arg))));\n          } else {\n            this.env.enter(this.envsForTco);\n            try {\n              args = this.sexpForTco.slice(1);\n              return op.call(this, args.map((arg) => this.__getSingleValue(this.eval(arg))));\n            } finally {\n              this.env.exit();\n              this.sexpForTco = null;\n              this.envsForTco = null;\n            }\n          }\n        } catch (error) {\n          if (error instanceof ReturnFromFunctionError){\n            if (error.sexp instanceof Array && error.sexp.length > 0){\n              this.env.enter(error.envs);\n              try {\n                op = this.eval(error.sexp[0]);\n              } finally {\n                this.env.exit();\n              }\n              this.sexpForTco = error.sexp;\n              this.envsForTco = error.envs;\n              continue;\n            } else {\n              this.env.enter(error.envs);\n              try {\n                return this.eval(error.sexp);\n              } finally {\n                this.env.exit();\n              }\n            }\n          }\n          throw error;\n        }\n      } else if (op instanceof ArrpMacro) {\n        return this.eval(op.expand(this, args));\n      } else {\n        return null; // TODO Error\n      }\n    }\n  }\n\n  eval(sexp) {\n    try {\n      if (typeof sexp === 'string' || typeof sexp === 'number') {\n        return sexp;\n      } else if (sexp === undefined || sexp === null) {\n        return sexp;\n      } else if (sexp instanceof Boolean) {\n        return sexp;\n      } else if (sexp === Infinity) {\n        return sexp;\n      } else if (sexp instanceof ArrpSymbol) {\n        if (typeof sexp.identifier === 'symbol') return this.env.get(sexp);\n        if ((new RegExp(/^js:/, 'i')).test(sexp.identifier)) {\n          return new ArrpJsMethod(sexp.identifier.slice(3));\n        }\n        return this.env.get(sexp);\n      } else if (sexp instanceof Array) {\n        if (sexp.length === 0) {\n          return sexp;\n        } else {\n          return this.call(this.eval(sexp[0]), sexp.slice(1));\n        }\n      }\n      return sexp;\n    } catch (error) {\n      let len = this.env.lexicalEnvsStack.length;\n      for (let count = 0; count < len; count++) {\n        this.env.exit();\n      }\n      throw error;\n    }\n  }\n\n  evalFromStack(sexps) {\n    try {\n      if (sexps.stack.length === 0) return '#<No Input>'; //TODO\n      let tmp = undefined; // TODO\n      while (true) {\n        let sexp = sexps.dequeue();\n        if (sexp === undefined) break;\n        tmp = this.eval(sexp);\n      }\n      return tmp;\n    } catch (error) {\n      return new ArrpMultipleValue(null, error);\n    }\n\n  }\n}\n\nmodule.exports = ArrpEvaluator;\n\n\n//# sourceURL=webpack:///./src/ArrpEvaluator.js?");

/***/ }),

/***/ "./src/ArrpExpandedValues.js":
/*!***********************************!*\
  !*** ./src/ArrpExpandedValues.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nclass ArrpExpandedValues {\n  constructor(values) {\n    this.values = values;\n  }\n\n  toString() {\n    if (this.values instanceof Array) {\n      return '<Expanded: ' + this.values.join(' ') + '>'; // TODO\n    }\n    return '<Expanded: ' + this.values + '>'; // TODO\n  }\n  inspect() {\n    return this.toString();\n  }\n}\n\nmodule.exports = ArrpExpandedValues;\n\n\n//# sourceURL=webpack:///./src/ArrpExpandedValues.js?");

/***/ }),

/***/ "./src/ArrpFunction.js":
/*!*****************************!*\
  !*** ./src/ArrpFunction.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nconst ArrpCallable = __webpack_require__(/*! ./src/ArrpCallable.js */ \"./src/ArrpCallable.js\");\nconst ReturnFromFunctionError = __webpack_require__(/*! ./src/ReturnFromFunctionError.js */ \"./src/ReturnFromFunctionError.js\");\n\nclass ArrpFunction extends ArrpCallable{\n  constructor (env, paramSexp, body) {\n    super();\n    this.envs = env.getLexicalEnvs();\n    this.params = this.__setParams(paramSexp);\n    body.unshift(ArrpSymbol.make('progn'));\n    this.body = body;\n  }\n\n  call(evaluator, args) {\n    evaluator.env.enter(this.envs);\n    try {\n      this.bind(evaluator.env, args);\n      return evaluator.eval(this.body);\n    } finally {\n      evaluator.env.exit();\n    }\n  }\n\n  toString() {\n    return '#<Arrp Function>';\n  }\n\n  inspect() {\n    return this.toString();\n  }\n}\n\nmodule.exports = ArrpFunction;\n\n\n//# sourceURL=webpack:///./src/ArrpFunction.js?");

/***/ }),

/***/ "./src/ArrpJsMethod.js":
/*!*****************************!*\
  !*** ./src/ArrpJsMethod.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\n\nclass ArrpJsMethod {\n  constructor(source) {\n    if (source instanceof Function) {\n      this.identifier = source.name;\n    } else if (source instanceof ArrpSymbol) {\n      this.identifier = source.identifier;\n    } else if (source instanceof ArrpJsMethod) {\n      this.identifier = source.identifier;\n    } else if (typeof source === 'string'){\n      this.identifier = source;\n    } else {\n      this.identifier = null; // TODO\n    }\n  }\n}\n\nmodule.exports = ArrpJsMethod;\n\n\n//# sourceURL=webpack:///./src/ArrpJsMethod.js?");

/***/ }),

/***/ "./src/ArrpMacro.js":
/*!**************************!*\
  !*** ./src/ArrpMacro.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nconst ArrpCallable = __webpack_require__(/*! ./src/ArrpCallable.js */ \"./src/ArrpCallable.js\");\n\nclass ArrpMacro extends ArrpCallable{\n  constructor (env, paramSexp, body) {\n    super();\n    this.envs = env.getLexicalEnvs();\n    this.params = this.__setParams(paramSexp);\n    body.unshift(ArrpSymbol.make('progn'));\n    this.body = body;\n  }\n\n  expand(evaluator, args) {\n    evaluator.env.enter(this.envs);\n    try {\n      this.bind(evaluator.env, args);\n      return evaluator.eval(this.body);\n    } finally {\n      evaluator.env.exit();\n    }\n  }\n\n  toString() {\n    return '#<Arrp Macro>';\n  }\n\n  inspect() {\n    return this.toString();\n  }\n\n}\n\nmodule.exports = ArrpMacro;\n\n\n//# sourceURL=webpack:///./src/ArrpMacro.js?");

/***/ }),

/***/ "./src/ArrpMultipleValue.js":
/*!**********************************!*\
  !*** ./src/ArrpMultipleValue.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst arrpPrint = __webpack_require__(/*! ./src/arrp-print.js */ \"./src/arrp-print.js\");\nclass ArrpMultipleValue {\n  constructor(...values) {\n    this.values = values;\n  }\n\n  top() {\n    return this.values[0];\n  }\n\n  toString() {\n    return this.values.map((elt) => arrpPrint(elt)).join('\\n');\n  }\n\n  inspect() {\n    return this.toString();\n  }\n\n}\nmodule.exports = ArrpMultipleValue;\n\n\n//# sourceURL=webpack:///./src/ArrpMultipleValue.js?");

/***/ }),

/***/ "./src/ArrpReader.js":
/*!***************************!*\
  !*** ./src/ArrpReader.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSexpStack = __webpack_require__(/*! ./src/ArrpSexpStack.js */ \"./src/ArrpSexpStack.js\")\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nconst ArrpComma = __webpack_require__(/*! ./src/ArrpComma.js */ \"./src/ArrpComma.js\");\nconst ArrpCommaAt = __webpack_require__(/*! ./src/ArrpCommaAt.js */ \"./src/ArrpCommaAt.js\");\n\nclass ArrpReader{\n  constructor() {\n    this.__stack = [[]];\n    this.__quote = [];\n  }\n\n  __setQuote(str) {\n    return this.__quote.push(str);\n  }\n\n  __push(sexp) {\n    if (this.__quote.length > 0) {\n      let quote = this.__quote.pop();\n      if (quote === \"'\") {\n        sexp = [ArrpSymbol.make('quote'), sexp];\n      } else if (quote === '`') {\n        sexp = [ArrpSymbol.make('quasi-quote'), sexp];\n      } else if (quote === ',') {\n        sexp = ArrpComma.make(sexp);\n      } else if (quote === ',@') {\n        sexp = ArrpCommaAt.make(sexp);\n      }\n      return this.__push(sexp)\n    }\n    return this.__stack[this.__stack.length - 1].push(sexp);\n  }\n\n  __makeArray() {\n    let arr = [];\n    this.__push(arr);\n    return this.__stack.push(arr);\n  }\n\n  __pop() {\n    return this.__stack.pop();\n  }\n\n  __resolveLiteral(str) {\n    if (str === 'Infinity') return Number.POSITIVE_INFINITY;\n    if (str === '-Infinity') return Number.NEGATIVE_INFINITY;\n    if (str === 'NaN') return Number.NaN;\n    if (str === 'undefined') return undefined;\n    if (str === 'null') return null;\n    // Boolean\n    if (str === 'true') return true;\n    if (str === 'false') return false;\n    // Integer\n    if (str.match(/^[+-]?[1-9]\\d*$/)) return Number(str);\n    if (str.match(/^[+-]?0[oO][0-7]+$/)) return Number(str);\n    if (str.match(/^[+-]?0[xX][\\da-fA-F]+$/)) return Number(str);\n    if (str.match(/^[+-]?0[bB][01]+$/)) return Number(str);\n    // Float\n    if (str.match(/^[+-]?(\\d+(.\\d*)?|.\\d+)([Ee][+-]?\\d+)?$/)) return Number(str);\n    // String\n    if (str.match(/^\"([^\\\\\"]|\\\\0|\\\\b|\\\\f|\\\\n|\\\\r|\\\\t|\\\\v|\\\\'|\\\\\"|\\\\\\\\|\\\\[0-3][0-7][0-7]|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]{5}\\})*\"$/)) return eval(str);\n    //\n    return new ArrpSymbol(str);\n  }\n\n  __makeToken(input, pos) {\n    let stack = [];\n    while (true) {\n      stack.push(String.fromCodePoint(input.codePointAt(pos)));\n      pos++;\n      if (input.codePointAt(pos) === undefined\n        || String.fromCodePoint(input.codePointAt(pos)) === '('\n        || String.fromCodePoint(input.codePointAt(pos)) === ')'\n        || String.fromCodePoint(input.codePointAt(pos)) === ';'\n        || String.fromCodePoint(input.codePointAt(pos)) === \"'\"\n        || String.fromCodePoint(input.codePointAt(pos)) === '`'\n        || String.fromCodePoint(input.codePointAt(pos)) === ','\n        || String.fromCodePoint(input.codePointAt(pos)).match(/^\\s/)) {\n       return [this.__resolveLiteral(stack.join('')), pos, true];\n      }\n    }\n  }\n\n  __makeString(input, pos) {\n    let stack = [];\n    while (true) {\n      stack.push(String.fromCodePoint(input.codePointAt(pos)));\n      if (String.fromCodePoint(input.codePointAt(pos)) === '\\\\') {\n        pos++;\n        stack.push(String.fromCodePoint(input.codePointAt(pos)));\n      }\n      pos++;\n      if (String.fromCodePoint(input.codePointAt(pos)) === '\"') {\n        stack.push(String.fromCodePoint(input.codePointAt(pos)));\n        pos++;\n        return [this.__resolveLiteral(stack.join('')), pos, true];\n      }\n      if (pos >= input.length) {\n        throw Error(input + \": \" + pos);\n      }\n    }\n  }\n\n  __purgeComment(input, pos) {\n    while (true) {\n      pos++\n      if (input.codePointAt(pos) === undefined\n      || String.fromCodePoint(input.codePointAt(pos)) === '\\n') {\n        pos++;\n        return ['', pos, null];\n      }\n      if (pos > input.length) {\n        throw Error(input + \": \" + pos);\n      }\n    }\n  }\n\n  __getToken(input, pos) {\n    if (input.codePointAt(pos) === undefined) return [null, false, null];\n    if (String.fromCodePoint(input.codePointAt(pos)) === \"'\") return [\"'\", pos + 1, \"'\"];\n    if (String.fromCodePoint(input.codePointAt(pos)) === '`') return ['`', pos + 1, '`'];\n    if (String.fromCodePoint(input.codePointAt(pos)) === ',') {\n      if (input[pos + 1] === '@') return [',@', pos + 2, `,@`];\n      return [',', pos + 1, `,`];\n    }\n    if (String.fromCodePoint(input.codePointAt(pos)) === '(') return ['(', pos + 1, '('];\n    if (String.fromCodePoint(input.codePointAt(pos)) === ')') return [')', pos + 1, ')'];\n    if (String.fromCodePoint(input.codePointAt(pos)).match(/^\\s/)) return ['', pos + 1, null];\n    if (String.fromCodePoint(input.codePointAt(pos)) === ';') return this.__purgeComment(input, pos);\n    if (String.fromCodePoint(input.codePointAt(pos)) === '\"') return this.__makeString(input, pos);\n    return this.__makeToken(input, pos);\n  };\n\n  __parse(input, readOne = false) {\n    let pos = 0;\n    let chk;\n    let token = null;\n    while (true) {\n      [token, pos, chk] = this.__getToken(input, pos);\n      if (chk === \"'\"\n        || chk === '`'\n        || chk === `,`\n        || chk === `,@`\n      ) {\n        this.__setQuote(token);\n        continue;\n      }\n      if (pos === false) break;\n      if (chk === null) continue;\n      if (token === '(') {\n        this.__makeArray();\n        continue;\n      }\n      if (token === ')') {\n        this.__pop();\n        continue;\n      }\n      this.__push(token);\n    }\n    if (this.__stack.length > 1) return null; // TODO\n    if (this.__stack.length === 0) throw new Error(); // TODO\n    if (readOne && this.__stack.length === 1) return new ArrpSexpStack(this.__stack[0]);\n    return new ArrpSexpStack(this.__stack[0]);\n  };\n\n  read(str, readOne = false) {\n    let stack = this.__parse(str, readOne);\n    if (stack !== null) this.__stack = [[]];\n    return stack;\n  };\n}\n\nmodule.exports = ArrpReader;\n\n\n//# sourceURL=webpack:///./src/ArrpReader.js?");

/***/ }),

/***/ "./src/ArrpSexpStack.js":
/*!******************************!*\
  !*** ./src/ArrpSexpStack.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nclass ArrpSexpStack {\n  constructor(sexps) {\n    this.stack = sexps;\n  }\n\n  dequeue() {\n    return this.stack.shift();\n  }\n}\n\nmodule.exports = ArrpSexpStack;\n\n\n//# sourceURL=webpack:///./src/ArrpSexpStack.js?");

/***/ }),

/***/ "./src/ArrpSpecial.js":
/*!****************************!*\
  !*** ./src/ArrpSpecial.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nclass ArrpSpecial {\n  constructor(callable) {\n    this.callable = callable;\n  }\n\n  call (evaluator, args) {\n    args.unshift(evaluator);\n    return this.callable.apply(null, args);\n  }\n\n  toString() {\n    return \"#<Arrp Special>\";\n  }\n\n  inspect() {\n    return this.toString();\n  }\n}\n\nmodule.exports = ArrpSpecial;\n\n\n//# sourceURL=webpack:///./src/ArrpSpecial.js?");

/***/ }),

/***/ "./src/ArrpSymbol.js":
/*!***************************!*\
  !*** ./src/ArrpSymbol.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nclass ArrpSymbol {\n  constructor(identifier) {\n    this.identifier = identifier;\n  }\n\n  toString() {\n    if (typeof this.identifier === 'symbol') return '#<gensym-' + this.identifier.toString().slice(7, -1) + '>';\n    return `${this.identifier}`;\n  }\n  inspect() {\n    return this.toString();\n  }\n\n  eq(sym) {\n    return this.identifier === sym.identifier;\n  }\n\n  static make(str) {\n    return new ArrpSymbol(str);\n  }\n}\n\nmodule.exports = ArrpSymbol;\n\n\n//# sourceURL=webpack:///./src/ArrpSymbol.js?");

/***/ }),

/***/ "./src/ReturnFromFunctionError.js":
/*!****************************************!*\
  !*** ./src/ReturnFromFunctionError.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nclass ReturnFromFunctionError extends Error {\n  constructor(sexp, envs){\n    super('return with value');\n    this.sexp = sexp;\n    this.envs = envs;\n  }\n}\nmodule.exports = ReturnFromFunctionError;\n\n\n//# sourceURL=webpack:///./src/ReturnFromFunctionError.js?");

/***/ }),

/***/ "./src/arrp-builtins.js":
/*!******************************!*\
  !*** ./src/arrp-builtins.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nconst ArrpReader = __webpack_require__(/*! ./src/ArrpReader.js */ \"./src/ArrpReader.js\");\n\nconst arrpPrint = __webpack_require__(/*! ./src/arrp-print.js */ \"./src/arrp-print.js\");\n\nconst ArrpMacro = __webpack_require__(/*! ./src/ArrpMacro.js */ \"./src/ArrpMacro.js\");\nconst ArrpFunction = __webpack_require__(/*! ./src/ArrpFunction.js */ \"./src/ArrpFunction.js\");\nconst ArrpJsMethod = __webpack_require__(/*! ./src/ArrpJsMethod.js */ \"./src/ArrpJsMethod.js\");\nconst ArrpSpecial = __webpack_require__(/*! ./src/ArrpSpecial.js */ \"./src/ArrpSpecial.js\");\nconst ArrpMultipleValue = __webpack_require__(/*! ./src/ArrpMultipleValue.js */ \"./src/ArrpMultipleValue.js\");\n\nconst ReturnFromFunctionError = __webpack_require__(/*! ./src/ReturnFromFunctionError.js */ \"./src/ReturnFromFunctionError.js\");\n\nconst expandQuasiQuote = __webpack_require__(/*! ./src/expand-quasi-quote.js */ \"./src/expand-quasi-quote.js\")\n\nconst builtins = new Map();\n\n// Quote\n\nbuiltins.set('quote', new ArrpSpecial((evaluator, val) =>　{\n  return val;\n}));\n\n\nbuiltins.set('quasi-quote', new ArrpSpecial((evaluator, sexp) =>　{\n  evaluator.quasiQuoteCounter++;\n  let ret;\n  try {\n    ret = expandQuasiQuote(sexp, evaluator);\n  } catch (e){\n    throw e;\n  } finally {\n    evaluator.quasiQuoteCounter--;\n  }\n  return ret;\n}));\n\n// if and cond\n\nbuiltins.set('if', new ArrpSpecial((evaluator, cond, thenSexp, elseSexp) =>　{\n  return evaluator.eval(cond) !== false? evaluator.eval(thenSexp): evaluator.eval(elseSexp);\n}));\n\nbuiltins.set('cond', new ArrpSpecial((evaluator, ...cond_bodys) =>　{\n  for (let cond_body of cond_bodys) {\n    if (!cond_body instanceof Array) throw Error('cond form error') // TODO\n    if (evaluator.eval(cond_body[0]) !== false) {\n      return evaluator.eval([ArrpSymbol.make('progn')].concat(cond_body.slice(1)));\n    }\n  }\n  return undefined;\n}));\n\n// progn\n\nbuiltins.set('progn', new ArrpSpecial((evaluator, ...body) =>　{\n    let tmp = null;\n    body.forEach((sexp) => {\n      tmp = evaluator.eval(sexp);\n    });\n    return tmp;\n}));\n\n// lambda and let\n\nbuiltins.set('lambda', new ArrpSpecial((evaluator, paramSexp, ...body) =>　{\n  return new ArrpFunction(evaluator.env, paramSexp, body);\n}));\n\nbuiltins.set('let', new ArrpSpecial((evaluator, params, ...body) =>　{\n  let vars = params.map((sexp) => sexp instanceof ArrpSymbol? sexp: sexp[0]);\n  let vals = params.map((sexp) => sexp instanceof ArrpSymbol? null: evaluator.eval(sexp[1]));\n\n  return (new ArrpFunction(evaluator.env, vars, body)).call(evaluator, vals);\n}));\n\n// set and delete\n\nbuiltins.set('set!', new ArrpSpecial((evaluator, sym, val) =>　{\n  if (sym instanceof ArrpSymbol) {\n    return evaluator.env.set(sym, evaluator.eval(val));\n  }\n  return undefined; // TODO\n}));\n\nbuiltins.set('set-g!', new ArrpSpecial((evaluator, sym, val) =>　{\n  return evaluator.env.setGlobal(sym, evaluator.eval(val));\n}));\n\nbuiltins.set('delete-g!', new ArrpSpecial((evaluator, sym) =>　{\n  return evaluator.env.deleteGlobal(sym);\n}));\n\n// defun and defmacro\n\nbuiltins.set('defun!', new ArrpSpecial((evaluator, sym, paramSexp, ...body) =>　{\n  return evaluator.env.setGlobal(sym, new ArrpFunction(evaluator.env, paramSexp, body));\n}));\n\nbuiltins.set('defmacro!', new ArrpSpecial((evaluator, sym, params, ...body) =>　{\n  return evaluator.env.setGlobal(sym, new ArrpMacro(evaluator.env, params, body));\n}));\n\nbuiltins.set('gensym', new ArrpSpecial((evaluator) =>　{\n  let rand = '';\n  for (let c = 0; c < 6; c++){\n    rand += Math.floor(Math.random() * 10);\n  }\n  return ArrpSymbol.make(Symbol(rand));\n}));\n\n// MultipleValue\nbuiltins.set('multiple-value-list', new ArrpSpecial((evaluator, sexp) =>　{\n  let val = evaluator.eval(sexp);\n  if (val instanceof ArrpMultipleValue) {\n    return val.values.slice(0);\n  } else {\n    return [val];\n  }\n}));\n\n// Read\nbuiltins.set('read', new ArrpSpecial((evaluator, str) =>　{\n  let stackOrNull = (new ArrpReader()).read(str, true);\n  return stackOrNull? stackOrNull.dequeue(): null;\n}));\n\n// Print\nbuiltins.set('print', arrpPrint);\n\n// Eval\nbuiltins.set('eval', new ArrpSpecial((evaluator, sexp) =>　{\n  return evaluator.eval(evaluator.eval(sexp));\n}));\n\n// Return\nbuiltins.set('return', new ArrpSpecial((evaluator, sexp) =>　{\n  throw new ReturnFromFunctionError(sexp, evaluator.env.getLexicalEnvs());\n}));\n\n// Package\nbuiltins.set('change-package!', new ArrpSpecial((evaluator, pkg) =>　{\n  let name = 'ARRP-USER';\n  if (pkg instanceof ArrpSymbol) {\n    name = pkg.identifier;\n  } else if (typeof pkg === 'string') {\n    name = pkg;\n  } else {\n    return 'package must be specified by string or symbol';\n  }\n  if (name.toUpperCase() === 'JS') {\n    return 'can not change to JS package.';\n  }\n  return evaluator.env.changePkg(name.toUpperCase());\n}));\nbuiltins.set('current-package', new ArrpSpecial((evaluator) =>　{\n  return evaluator.env.getPkg();\n}));\n\n// JS Method\nbuiltins.set('jsm', new ArrpSpecial((evaluator, id) =>　{\n  return new ArrpJsMethod(id);\n}));\n\n// as JS Function\nbuiltins.set('as-jsf', new ArrpSpecial((evaluator, func) =>　{\n  func = evaluator.eval(func);\n  if (func instanceof ArrpFunction) {\n    return (...args) => func.call(evaluator, args);\n  } else {\n    return null;\n  }\n}))\n\n// URI\nbuiltins.set('decode-uri', decodeURI)\nbuiltins.set('encode-uri', encodeURI)\nbuiltins.set('decode-uri-component', decodeURIComponent)\nbuiltins.set('encode-uri-component', encodeURIComponent)\n\n// Logical\nbuiltins.set('not', (arg) => arg === false? true: false);\nbuiltins.set('and', (...args) => {\n    for (let elt of args){\n      if (elt === false) return false;\n    }\n    return args[args.length -1];\n});\nbuiltins.set('or', (...args) => {\n    for (let elt of args){\n      if (elt !== false) return elt;\n    }\n    return false;\n});\n\n// Comparision\nconst compare = (ifnot) => (...args) => {\n  let top = args.shift();\n  for (let num of args){\n    if (ifnot(top, num)) return false;\n    top = num\n  }\n  return true;\n};\n\nbuiltins.set('=', compare((top, num) => top !== num));\nbuiltins.set('~', compare((top, num) => top != num));\nbuiltins.set('>', compare((top, num) => top <= num));\nbuiltins.set('<', compare((top, num) => top >= num));\nbuiltins.set('>=', compare((top, num) => top < num));\nbuiltins.set('<=', compare((top, num) => top > num));\n\nbuiltins.set('/=', (...number) => {\n  if (number.length === 0) return true;\n  let uniq = number.filter((elt, ind, arr) => arr.indexOf(elt) === ind);\n  return uniq.length === number.length;\n});\n\n// Arithemetic　\nbuiltins.set('+', (...numbers) =>　numbers.reduce((prev, curr) => prev + curr));\nbuiltins.set('-', (top, ...numbers) => numbers.length === 0? - top: top - numbers.reduce((prev, curr) => prev + curr));\nbuiltins.set('*', (...numbers) =>　numbers.reduce((prev, curr) => prev * curr));\nbuiltins.set('/', (top, ...numbers) => numbers.length === 0? 1 / top: top / numbers.reduce((prev, curr) => prev * curr));\nbuiltins.set('%', (top, ...numbers) => numbers.length === 0? top: numbers.reduce((prev, curr) => prev % curr, top));\nbuiltins.set('rem', (num1, num2) => new ArrpMultipleValue(Math.floor(num1 / num2), num1 % num2));\n\n// Object TODO\nbuiltins.set('new-object', () => {return {};});\nbuiltins.set('get-prop', (obj, prop) => obj[prop]);\nbuiltins.set('.', new ArrpSpecial((evaluator, obj, prop) =>　{\n  let propName = '';\n  if (prop instanceof ArrpSymbol) {\n    propName = prop.identifier;\n  } else if (typeof prop === 'string') {\n    propName = prop;\n  } else if (typeof prop === 'number') {\n    propName = prop;\n  } else if (typeof prop === 'symbol') {\n    propName = prop;\n  } else {\n    return null;\n  }\n  return evaluator.eval(obj)[propName];\n}));\nbuiltins.set('set-prop!', (obj, prop, val) => obj[prop] = val);\n\n// Math\nbuiltins.set('+E+', Math.E);\nbuiltins.set('+LN-2+', Math.LN2);\nbuiltins.set('+LN-10+', Math.LN10);\nbuiltins.set('+LOG-2-E+', Math.LOG2E);\nbuiltins.set('+LOG-10-E+', Math.LOG10E);\nbuiltins.set('+PI+', Math.PI);\nbuiltins.set('+SQRT-1/2+', Math.SQRT1_2);\nbuiltins.set('+SQRT-2+', Math.SQRT2);\n\nconst mathFuncNames = [\n  'abs',\n  'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh',\n  'cos', 'cosh', 'sin', 'sinh', 'tan', 'tanh',\n  'exp', 'expm1', 'log', 'log1p', 'log10',\n  'cbrt', 'sqrt',\n  'ceil', 'floor', 'trunc',\n  'fround', 'round',\n  'clz32', 'sign',\n  'atan2', 'hypot', 'imul', 'max', 'min', 'pow'\n];\nfor (let name of mathFuncNames) {\n  builtins.set(name, Math[name]);\n}\n\n// Number\nbuiltins.set('+EPSILON+', Number.EPSILON);\nbuiltins.set('+MAX-SAFE-INTEGER+', Number.MAX_SAFE_INTEGER);\nbuiltins.set('+MIN-SAFE-INTEGER+', Number.MIN_SAFE_INTEGER);\nbuiltins.set('+MAX-VALUE+', Number.MAX_VALUE);\nbuiltins.set('+MIN-VALUE+', Number.MIN_VALUE);\n\nbuiltins.set('is-NaN', Number.isNaN);\nbuiltins.set('is-finite', Number.isFinite);\nbuiltins.set('is-integer', Number.isInteger);\nbuiltins.set('is-safe-nteger', Number.isSafeInteger);\nbuiltins.set('parse-float', Number.parseFloat);\nbuiltins.set('parse-int', Number.parseInt);\nbuiltins.set('to-exponential', (num, fd) => (new Number(num)).toExponential(fd));\nbuiltins.set('to-fixed', (num, digits) => (new Number(num)).toFixed(digits));\nbuiltins.set('to-precision', (num, precision) => (new Number(num)).toPrecision(precision));\n\n// Date\nbuiltins.set('date', (year, month = 1, day = 1, hour = 0, minutes = 0, seconds = 0, milliseconds = 0) => new Date(year, month - 1, day, hour, minutes, seconds, milliseconds));\nbuiltins.set('date-from-time', (time) => new Date(time));\nbuiltins.set('date-now', Date.now);\nbuiltins.set('date-utc', Date.UTC);\n\n// RegExp\nbuiltins.set('regex', (pattern, flags) => RegExp(pattern, flags));\n\n// String\nbuiltins.set('from-char-code', String.fromCharCode);\nbuiltins.set('from-code-point', String.fromCodePoint);\n\n// Array\nbuiltins.set('array', (...vals) =>　Array.from(vals));\nbuiltins.set('nth', (arr, ind) =>　arr[ind]);\nbuiltins.set('replace-nth!', (arr, ind, val) =>　arr[ind] = val);\nbuiltins.set('first', (arr) =>　arr[0]);\nbuiltins.set('rest', (arr) =>　arr.slice(1));\nbuiltins.set('cons', (first, rest) =>　([first]).concat(rest));\nbuiltins.set('last', (arr) =>　arr[arr.length - 1]);\nbuiltins.set('fill!', (arr, ...args) => arr.fill.apply(arr, args));\nbuiltins.set('push!', (arr, ...vals) => arr.push.apply(arr, vals));\nbuiltins.set('pop!', (arr) => arr.pop());\nbuiltins.set('unshift!', (arr, ...vals) => arr.unshift.apply(arr, vals));\nbuiltins.set('shift!', (arr) => arr.shift());\nbuiltins.set('splice!', (arr, ...args) => arr.splice.apply(arr, args));\nbuiltins.set('concat', (obj, ...arrs) =>　obj.concat.apply(obj, arrs));\nbuiltins.set('length', (obj) =>　obj.length);\nbuiltins.set('slice', (obj, ...args) =>　obj.slice.apply(obj, args));\nbuiltins.set('copy-within!', (arr, ...args) => arr.copyWithin.apply(arr, args));\nbuiltins.set('reverse!', (arr) => arr.reverse());\nbuiltins.set('sort!', (arr) => arr.sort()); // TODO\nbuiltins.set('join', (arr, sep) =>　arr.join(sep));\nbuiltins.set('index-of', (obj, ...args) =>　obj.indexOf.apply(obj, args));\nbuiltins.set('last-index-of', (obj, ...args) =>　obj.lastIndexOf.apply(obj, args));\n\n// ArrayBuffer\nbuiltins.set('array-buffer', (length) => new ArrayBuffer(length));\n\n// Typed Array\nconst typedArray = {\n  'int-8-array': Int8Array,\n  'uint-8-array': Uint8Array,\n  'uint-8-clamped-array': Uint8ClampedArray,\n  'int-16-array': Int16Array,\n  'uint-16-array': Uint16Array,\n  'int-32-array': Int32Array,\n  'uint-32-array': Uint32Array,\n  'float-32-array': Float32Array,\n  'float-64-array': Float64Array,\n};\n\nfor (let name in typedArray){\n  builtins.set(name, (...args) => {\n    if (args.length === 0) {\n      return new typedArray[name]();\n    } else if (args.length === 1) {\n      return new typedArray[name](args[0]);\n    } else if (args.length === 2) {\n      return new typedArray[name](args[0], args[1]);\n    } else if (args.length === 3) {\n      return new typedArray[name](args[0], args[1], args[2]);\n    }\n    throw Error('invalid argumens');\n  });\n}\n\n// DataView\nbuiltins.set('data-view', (...args) => {\n  if (args.length === 0) {\n    return new DataView();\n  } else if (args.length === 1) {\n    return new DataView(args[0]);\n  } else if (args.length === 2) {\n    return new DataView(args[0], args[1]);\n  } else if (args.length === 3) {\n    return new DataView(args[0], args[1], args[2]);\n  }\n  throw Error('invalid argumens');\n});\n\n// Map\nbuiltins.set('make-map', (arg) => new Map(arg));\n\n// Set\nbuiltins.set('make-set', (arg) => new Set(arg));\n\n// JSON\nbuiltins.set('json-parse', (str) =>　JSON.parse(str));\nbuiltins.set('json-stringify', (val) =>　JSON.stringify(val));\n\n// Intl\nbuiltins.set('intl-collator', (...args) => Intl.Collator.apply(null,args));\n\nbuiltins.set('intl-datetime-format', (...args) => Intl.DateTimeFormat.apply(null,args));\n\nbuiltins.set('intl-number-format', (...args) => Intl.NumberFormat.apply(null,args));\n\n// EXPORTS\nmodule.exports = builtins;\n\n\n//# sourceURL=webpack:///./src/arrp-builtins.js?");

/***/ }),

/***/ "./src/arrp-print.js":
/*!***************************!*\
  !*** ./src/arrp-print.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nlet arrpPrint = (sexp) => {\n  if (sexp instanceof Array) {\n    if (sexp[0] instanceof ArrpSymbol){\n      if (sexp[0].identifier === 'quote') return \"'\" + arrpPrint(sexp[1]);\n      if (sexp[0].identifier === 'quasi-quote') return \"`\" + arrpPrint(sexp[1]);\n    }\n    return \"(\" + sexp.map((elt) => arrpPrint(elt)).join(' ') + \")\";\n  } else if (typeof sexp === 'string'){\n    return JSON.stringify(sexp);\n  } else if (!(sexp instanceof Object)){\n    return String(sexp);\n  } else {\n    return sexp.toString();\n  }\n};\nmodule.exports = arrpPrint;\n\n\n//# sourceURL=webpack:///./src/arrp-print.js?");

/***/ }),

/***/ "./src/expand-quasi-quote.js":
/*!***********************************!*\
  !*** ./src/expand-quasi-quote.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst ArrpSymbol = __webpack_require__(/*! ./src/ArrpSymbol.js */ \"./src/ArrpSymbol.js\");\nconst ArrpComma = __webpack_require__(/*! ./src/ArrpComma.js */ \"./src/ArrpComma.js\");\nconst ArrpCommaAt = __webpack_require__(/*! ./src/ArrpCommaAt.js */ \"./src/ArrpCommaAt.js\");\nconst ArrpExpandedValues = __webpack_require__(/*! ./src/ArrpExpandedValues.js */ \"./src/ArrpExpandedValues.js\");\n\nlet expandQuasiQuote = (sexp, evaluator) => {\n  if (sexp instanceof Array) {\n    if (sexp[0] instanceof ArrpSymbol && sexp[0].identifier === 'quasi-quote'){\n      evaluator.quasiQuoteCounter++;\n      let arr;\n      try {\n        arr = [sexp[0], expandQuasiQuote(sexp[1], evaluator)];\n      } catch (e) {\n        throw e;\n      } finally {\n        evaluator.quasiQuoteCounter--;\n      }\n      return arr;\n    }\n    let arr = [];\n    for (let elt of sexp) {\n      let expanded = expandQuasiQuote(elt, evaluator);\n      if (expanded instanceof ArrpExpandedValues) {\n        let values = expanded.values;\n        if (values instanceof Array) {\n          values.forEach((val) => {\n            arr.push(val)\n          });\n        } else {\n          arr.push(values);\n        }\n      } else {\n        arr.push(expanded);\n      }\n    }\n    return arr;\n  } else if (sexp instanceof ArrpComma) {\n    if (evaluator.quasiQuoteCounter > evaluator.commaCounter + 1) {\n      evaluator.commaCounter++;\n      let val;\n      try{\n        val = ArrpComma.make(expandQuasiQuote(sexp.sexp, evaluator));\n      } catch (e){\n        throw e;\n      } finally {\n        evaluator.commaCounter--;\n      }\n      return val;\n    } else if (evaluator.quasiQuoteCounter === evaluator.commaCounter + 1) {\n      evaluator.commaCounter++;\n      let val;\n      try{\n        val = evaluator.eval(sexp.sexp);\n      } catch (e){\n        throw e;\n      } finally {\n        evaluator.commaCounter--;\n      }\n      return val;\n    } else {\n      throw new Error('comma not inside quasi-quote');\n    }\n  } else if (sexp instanceof ArrpCommaAt) {\n    if (evaluator.quasiQuoteCounter > evaluator.commaCounter + 1) {\n      evaluator.commaCounter++;\n      let val;\n      try{\n        val = ArrpCommaAt.make(expandQuasiQuote(sexp.sexp, evaluator));\n      } catch (e){\n        throw e;\n      } finally {\n        evaluator.commaCounter--;\n      }\n      return val;\n    } else if (evaluator.quasiQuoteCounter === evaluator.commaCounter + 1) {\n      evaluator.commaCounter++;\n      let val;\n      try{\n        val = new ArrpExpandedValues(evaluator.eval(sexp.sexp));\n\n      } catch (e){\n        throw e;\n      } finally {\n        evaluator.commaCounter--;\n      }\n      return val;\n    } else {\n      throw new Error('comma not inside quasi-quote');\n    }\n  } else {\n    return sexp;\n  }\n};\nmodule.exports = expandQuasiQuote;\n\n\n//# sourceURL=webpack:///./src/expand-quasi-quote.js?");

/***/ })

/******/ });