'use strict';
const ARRP = require('./arrp.js');
const arrp = new ARRP();
let codes = document.querySelectorAll('script[type="text/arrp"]');
for (let ind = 0; ind < codes.length; ind++) {
  console.log(arrp.evalFromStack(arrp.read(codes[ind].innerHTML)));
}
