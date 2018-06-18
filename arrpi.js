'use strict';
const ARRP = require(__dirname + '/arrp.js');
const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const arrpNodeBuiltins = require(__dirname + '/src/arrp-node-builtins.js');
const arrpiBuiltins = new Map();

arrpiBuiltins.set('exit', () => {reader.close();process.exit();});

const arrp = new ARRP(arrpNodeBuiltins, arrpiBuiltins);

const prompt = () =>  arrp.getPkg() + '> ';

const wait =  () => '.'.repeat(prompt().length - 1) +  ' ';

reader.on('line', function(line) {
  try {
    let stackOrNull = arrp.read(line);
    if (stackOrNull) {
      console.log(arrp.print(arrp.evalFromStack(stackOrNull)));
      reader.setPrompt(prompt(), prompt().length);
    } else {
      reader.setPrompt(wait(), wait().length);
    }
  } catch (error) {
    console.log(error);
    console.log('-- reset reader --');
    arrp.resetReader();
  }
  reader.prompt();
});

reader.on('close', function() {
  console.log('\nBye\n');
});

reader.setPrompt(prompt(), prompt().length);
reader.prompt();
