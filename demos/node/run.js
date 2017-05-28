
var fs = require('fs');
var lio = require('./../../lio.js');

var code = fs.readFileSync('demo.io', {encoding: 'utf-8'});
var _lio = lio.lib;

console.log(eval(lio.compile(code)));
