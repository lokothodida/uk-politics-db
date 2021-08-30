IMPORTS := --import-map=imports.json

fmt:
	docker-compose run deno deno fmt src

lint:
	docker-compose run deno deno lint src

build:
	docker-compose run deno deno bundle $(IMPORTS) src/index.js dist/bundle.js
	cp src/index.html dist/index.html

