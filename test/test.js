const util = require('util');
const printFull = (obj) => console.log(util.inspect(obj, false, null));
const ESC = String.fromCharCode(27);
const red = (str) => `${ESC}[31m${str}${ESC}[39m`;
const green = (str) => `${ESC}[32m${str}${ESC}[39m`;
const tests = [];
const testCase = (title, target, expected, strict = true) => {
  tests.push(() => {
    let val = target();
    let eq = (a, b) => false;
    if (strict === true) {
       eq = (a, b) => a === b;
    } else {
       eq = (a, b) => a == b;
    }
    if (eq(val, expected)) {
      console.log(`${title}:\n ${green('OK')}: ${val} (expected: ${expected})`);
      return 1;
    } else {
      console.log(`${title}:\n ${red('NG')}: ${val} (expected: ${expected})`);
      return 0;
    }
  });
};
const testCase2 = (title, test) => {
  tests.push(() => {
    if (test()) {
      console.log(`${title}:\n ${green('OK')}`);
      return 1;
    } else {
      console.log(`${title}:\n ${red('NG')}`);
      return 0;
    }
  });
};

const runTests = () => {
  let pass_num = 0;
  tests.forEach((test) => {
    pass_num += test();
  });
  console.log(`PASS: ${pass_num} / ${tests.length}`);
};


console.log('Load Arrp and playground');
const ArrpComma = require(__dirname + '/../src/ArrpComma.js');
const ArrpSymbol = require(__dirname + '/../src/ArrpSymbol.js');
const ArrpReader = require(__dirname + '/../src/ArrpReader.js');
const ar = new ArrpReader();
const read = (str) => ar.read(str);

const ArrpEnvironment = require(__dirname + '/../src/ArrpEnvironment.js');
const env = new ArrpEnvironment();

const ArrpEval = require(__dirname + '/../src/ArrpEvaluator.js');
const ae = new ArrpEval(env);
const readEval = (str) => ae.evalFromStack((read(str)));
//printFull(read('((lambda (x) (list x (list (quote quote) x))) (quote (lambda (x) (list x (list (quote quote) x))))'));
//printFull(read('(+ 1 2 3 4 5 6 7 8 9 10)'));
printFull(read('(split "cl,scheme,clojure,arrp" ",")'));
printFull(read("hoge,piyo,fuga"));

let f = readEval("(let ((q '(r s))) ``(',,q))");
printFull(f);

console.log(readEval(`
(defun! fact (num)
  (if (<= num 1)
      1
      (* num (fact (- num 1)))))`));
console.log(readEval(`(fact 10)`));

console.log('Start Arrp test');

/*
testCase('parse integer [42]', () => readEval('42'), 42);
testCase('parse integer [0o52]', () => readEval('0o52'), 42);
testCase('parse integer [-0o52]', () => readEval('-0o52'), -42);
testCase('parse integer [0x2a]', () => readEval('0x2a'), 42);
testCase('parse integer [-0X2A]', () => readEval('-0X2A'), -42);
testCase('parse integer [0B101010]', () => readEval('0B101010'), 42);
testCase('parse integer [+0b101010]', () => readEval('+0b101010'), 42);

testCase('parse float [3.1415926]', () => readEval('3.1415926'), 3.1415926);
testCase('parse float [-.123456789]', () => readEval('-.123456789'), -.123456789);
testCase('parse float [-3.1E+12]', () => readEval('-3.1E+12'), -3.1E+12);
testCase('parse float [.1e-23]', () => readEval('.1e-23'), .1e-23);

testCase('parse Strig ["hoge"]', () => readEval('"hoge"'), "hoge");
testCase('parse Strig ["\\0\\b\\f\\n\\r\\t\\v"]', () => readEval('"\\0\\b\\f\\n\\r\\t\\v"'), "\0\b\f\n\r\t\v");
testCase('parse Strig ["\\xA9\\u00A9\\u{20BB7}"]', () => readEval('"\\xA9\\u00A9\\u{20BB7}"'), "\xA9\u00A9\u{20BB7}");

testCase('parse Infinity', () => readEval('Infinity'), Infinity);
testCase('parse null', () => readEval('null'), null);
testCase('parse undefined', () => readEval('undefined'), undefined);
testCase('parse true', () => readEval('true'), true);
testCase('parse false', () => readEval('false'), false);

runTests();
*/
console.log('End test');
