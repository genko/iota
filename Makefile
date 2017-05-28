
JISON = ./node_modules/.bin/jison
BROWSERIFY = ./node_modules/.bin/browserify

BROWSER_DEMOS = demos/browser

all: ./node_modules parser browser

parser: src/parser.js

src/parser.js: src/parser.jison
	$(JISON) src/parser.jison -o src/parser.js

browser: $(BROWSER_DEMOS)/lio-browser.js $(BROWSER_DEMOS)/lib.js lio-browser.js lib.js

$(BROWSER_DEMOS)/lio-browser.js $(BROWSER_DEMOS)/lib.js lio-browser.js lib.js: src/*.js lio.js
	$(BROWSERIFY) -r ./lio.js:lio -o $(BROWSER_DEMOS)/lio-browser.js
	cp src/lib.js $(BROWSER_DEMOS)/lib.js
	cp src/lib.js .
	cp $(BROWSER_DEMOS)/lio-browser.js .

./node_modules:
	npm install jison
	npm install browserify
	npm install escodegen
	npm install ast-types
	npm install jasmine-node

clean:
	rm -rf demos/browser/lio-browser.js
	rm -rf demos/browser/lib.js
	rm -rf lib.js
	rm -rf lio-browser.js
	rm -rf src/parser.js

dist-clean: clean
	rm -rf node_modules

test:
	./node_modules/.bin/jasmine-node test/lio-spec.js

.PHONY: test clean dist-clean
