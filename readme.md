Iota
====

Iota is a source-to-source compiler which accepts parts of the [Io language](http://iolanguage.org/) code and outputs JavaScript.

The project is very much still in its infancy: only a minimal subset of Io is implemented. A number of core constructs and much of the standard library are not yet done.

Try it out [here](http://genko.github.com). Chrome works, Firefox gives JS error.

Features
--------

- JavaScript interoperability
- messages, objects, methods
- prototype chain
- global and local contexts
- infix operators (supporting different precedence levels)
- assignment operator
- primitives: strings, numbers, boolean values, `nil`

Still to come
-------------

- `self`
- first-class primitive methods
- primitives: lists
- call introspection
- library methods
- prototype tree
- proper scope chain
- proper lazy argument evaluation
- defining operators of custom precedence
- defining assignment operators
- concurrency

Dependencies
------------

- [node.js](http://nodejs.org/)
- [Escodegen](https://github.com/Constellation/escodegen)
- [ast-types](https://github.com/benjamn/ast-types)

**Development**

- `make`
- [Jison](http://zaach.github.io/jison/)
- [Browserify](http://browserify.org/)
- [Jasmine](https://github.com/mhevery/jasmine-node)

The AST constructed by the parser complies with the [Mozilla Parser API](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API) specification.

Installation
------------

`npm install [-g] iota-compiler`

Installing globally gives you easy access to the command-line interface.

Usage
-----

**node.js**

```js
var iota = require('iota-compiler');

var ioProgram = 'fact := method(n, if (n == 0, 1, n * fact (n - 1))); fact(5)';
iota.eval(ioProgram);
// => 120

// Lower-level API:

var _io = iota.lib; // make runtime library available
var result = eval(iota.compile(ioProgram));
_io.unwrapIoValue(result);
// => 120
_io.getTypeOf(result);
// => Number
```
**Browser**

A demo of Iota running in a web page may be found in `./demos/browser`.

Simply include `iota-browser.js` and `lib.js` in your web page. Usage is the same as with node (complete with `require`, courtesy of Browserify), except that the `_io` binding isn't required.

**CLI**

```
iota ./demos/node/demo.io
```
You'll have to install Iota globally for this to work. Installing locally will place the executable at `node_modules/.bin/iota` intead.

API
---

```js
iota.parse(code[, options]);
```
Parses a string of Io code and returns a JavaScript object representing the resulting AST.

```js
iota.compile(code[, options]);
```
Parses, then outputs ready-to-run JavaScript.

`options` is a JavaScript object that allows you to tweak the behaviour of the parser:

- `wrapWithFunction` If true, the compiled output will be wrapped in a function to facilitate interaction with the outside world. Defaults to `false`.
- `useProxy` If true, messages sent to `Lobby` will be directed instead to a special proxy object, which converts these messages into JavaScript method invocations. Meant to be used with `wrapWithFunction`, so the wrapped function can be invoked with a dynamic `this`. Defaults to `false`.
- `functionName` The name given to the wrapper function if `wrapWithFunction` is true. You can also pass a string such as `obj.property`, in which case the function will be bound to the corresponding property on the object in the current scope (this way you can `eval` the compiled code without the function being bound globally). Defaults to `io`.
- `self` The name of object that the wrapper function is being invoked with. Defaults to `self`.
- `runtimeLib` The name of the runtime library binding that Iota will look for. Defaults to `_io`.

```js
iota.eval(code);
```
Convenience method that evalutes a string of Io code, then unwraps and returns the result.

JavaScript Interop
------------------

**Primitives**

A number of Io primitives are bound to their JavaScript equivalents. For example, `writeln` invokes `console.log`.

**Executing Io code from JavaScript**

The simplest way is to use `iota.eval` as shown above.

`iota.compile` gives a greater level of control, with provisions for wrapping the generated code in a function and executing it in the context of an arbitrary object. An example of the former:

```js
var jsCode = iota.compile(ioCode, {
    wrapWithFunction: true,
    functionName: 'ioFromJS'
});
eval(jsCode);

ioFromJS();
```
Calling `eval` will make a function named `ioFromJS` available in the global scope (see the `functionName` option if this is undesirable; more sophisticated sandboxing can also be used). It will implicitly return the value of the last Io statement.

**Executing JavaScript code from Io**

An additional option, `useProxy`, should be set:

```js
var jsCode = iota.compile(ioCode, {
    wrapWithFunction: true,
    functionName: 'jsFromIo',
    useProxy: true
});
eval(jsCode);

jsFromIo.call({a: 24601, b: function() {return 'one day more';}});
```
The function may then be invoked using `call`, `apply`, or `bind` on a JavaScript object. Properties of the object will be made available as Io objects in the Io scope chain (right before `Lobby`). Messages passed to them will be translated into property accesses or method invocations, and arguments will be relayed appropriately. The value of the last Io statement will be returned.

License
-------
[MIT](http://opensource.org/licenses/MIT)
