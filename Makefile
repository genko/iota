
JISON = ./node_modules/.bin/jison
BROWSERIFY = ./node_modules/.bin/browserify

BROWSER_DEMOS = demos/browser

all: ./node_modules parser browser

parser: src/parser.js

src/parser.js: src/parser.jison
	$(JISON) src/parser.jison -o src/parser.js

browser: $(BROWSER_DEMOS)/iota-browser.js $(BROWSER_DEMOS)/lib.js iota-browser.js lib.js

$(BROWSER_DEMOS)/iota-browser.js $(BROWSER_DEMOS)/lib.js iota-browser.js lib.js: src/*.js iota.js
	$(BROWSERIFY) -r ./iota.js:iota-compiler -o $(BROWSER_DEMOS)/iota-browser.js
	cp src/lib.js $(BROWSER_DEMOS)/lib.js
	cp src/lib.js .
	cp $(BROWSER_DEMOS)/iota-browser.js .

./node_modules:
	npm install jison
	npm install browserify
	npm install escodegen
	npm install ast-types
	npm install jasmine-node
clean:
	rm -rf node_modules
	rm -rf demos/browser/iota-browser.js
	rm -rf demos/browser/lib.js
	rm -rf lib.js
	rm -rf iota-browser.js
	rm -rf src/parser.js

test:
	./node_modules/.bin/jasmine-node test/iota-spec.js

.PHONY: test clean
