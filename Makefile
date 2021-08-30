fmt:
	docker-compose run deno deno fmt src

lint:
	docker-compose run deno deno lint src

copy-files:
	cp src/index.html dist/index.html
	cp -r src/tables dist/tables
	cp -r data dist/data

bundle-dev:
	docker-compose run deno deno bundle --import-map=imports.dev.json src/index.js dist/bundle.js

bundle-prod:
	docker-compose run deno deno bundle --import-map=imports.prod.json src/index.js dist/bundle.js
