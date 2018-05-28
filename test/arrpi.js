const read = require(__dirname + '/../src/arrp-reader.js');

const builtins = require(__dirname + '/../src/arrp-builtins.js');
const ArrpEnvironment = require(__dirname + '/../src/ArrpEnvironment.js');
const env = new ArrpEnvironment(builtins);

const ArrpEval = require(__dirname + '/../src/ArrpEvaluator.js');
const ae = new ArrpEval(env);
const readEval = (str) => ae.evalFromStack((read(str)));

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

ae.env.setGlobal({str:'exit'}, () => {reader.close();process.exit();});

const prompt = 'ARRP> ';

let readStack = [];

reader.on('line', function(line) {
  readStack.push(line);
  console.log(readEval(readStack.join('')));
  readStack = [];
  reader.setPrompt(prompt, prompt.length);
  reader.prompt();
});

reader.on('close', function() {
  console.log('\nBye\n');
});

reader.setPrompt(prompt, prompt.length);
reader.prompt();
