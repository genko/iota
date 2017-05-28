
var lio = require('../lio');
var _lio = lio.lib;

describe('runtime', function() {
	it('basics', function() {
		expect(lio.eval('1000')).toBe(1000);
		expect(lio.eval('\n;1;\n;\n2 3;;')).toBe(3);
		expect(lio.eval('\n;1;//aa akkdh jkh\n;\n2 4;;')).toBe(4);
		expect(lio.eval('\n;1;#aa akkdh jkh\n;\n3 5;;')).toBe(5);
		expect(lio.eval('\n;1;/*aa akkdh jkh\nasds\n*/;\n3 6;;')).toBe(6);
		expect(lio.parse('')).toEqual({
		    "type": "Program",
		    "body": [],
		    loc: null
		});
		expect(lio.compile('')).toBe('');
		expect(lio.eval('')).toBe(null);
	});
	it('if', function () {
		expect(lio.eval('if(true, 1000, 2000)')).toBe(1000);
		expect(lio.eval('if(false, 1000, 2000)')).toBe(2000);
	});
	it('operators', function () {
		expect(lio.eval('1 +(2 *(3))')).toBe(7);
		expect(lio.eval('true and(true)')).toBe(true);
		expect(lio.eval('true and(1 ==(2))')).toBe(false);
		expect(lio.eval('Person := Object clone; Person ==(Person)')).toBe(true);
	});
	it('object and messages', function() {
		expect(lio.eval('Lobby setSlot("Person", Object clone); Person hello := 1; Person hello')).toBe(1);
		expect(lio.eval('Person talk := method(name, name charAt(2)); Person talk("billy")')).toEqual('l');
		expect(lio.eval('Person := Object clone; Person talk := method(name); bob := Person clone; bob name := "bob"; bob talk')).toEqual('bob');
	});
	it('recursion', function() {
		expect(lio.eval('fact := method(n, if(n ==(0), 1, n *(fact(n -(1))))); fact(5)')).toBe(120);
	});
	it('invoking methods of an arbitrary object', function () {
		var history = [];
		function log (s) {
			expect(s).toEqual('hello');
			history.push(s);
		}
		thisValue = {say: log};
		thisValue.moveDown = function () {
			expect(this).toEqual(thisValue);
			history.push('moveDown');
		};
		var code = 'moveDown;say("hello")'
		var context = {};
		eval(lio.compile(code, {
			wrapWithFunction: true,
			functionName: 'context.run',
			useProxy: true
		}));
		context.run.call(thisValue);
		expect(history).toEqual(['moveDown', 'hello'])
	});
});
