
var fs = require('fs');
var lio = require('./../../lio.js');

var code = fs.readFileSync('demo.io', {encoding: 'utf-8'});
console.log(lio.compile(code));
