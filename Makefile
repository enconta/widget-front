.DEFAULT_GOAL := help
.PHONY: setup build help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

setup: clean ## Setup project
	npm install

install: clean
	npm ci

start: ## Run project
	npm run start

clean: ## Remove node_modules
	rm -rf node_modules

test: ## Remove node_modules
	npm run test

test.coverage:
	npm run test --coverage

build: ## Build project with local settings
	npm run build

build.production: ## Build project with production settings
	API_SERVER=$$API_SERVER && PAYMENT_GATEWAY=$$PAYMENT_GATEWAY && PAYMENT_GATEWAY_ROUTE=$$PAYMENT_GATEWAY_ROUTE && APPSIGNAL_KEY=$$APPSIGNAL_KEY && ENCRYPTION_KEY=$$ENCRYPTION_KEY && INITIALIZATION_VECTOR=$$INITIALIZATION_VECTOR && npm run build

build.staging: ## Build project with staging settings
	API_SERVER=$$API_SERVER && PAYMENT_GATEWAY=$$PAYMENT_GATEWAY && PAYMENT_GATEWAY_ROUTE=$$PAYMENT_GATEWAY_ROUTE && APPSIGNAL_KEY=$$APPSIGNAL_KEY && ENCRYPTION_KEY=$$ENCRYPTION_KEY && INITIALIZATION_VECTOR=$$INITIALIZATION_VECTOR && npm run build

deploy.production: ## Deploy project with production settings
	sh bin/production

deploy.staging: ## Deploy project with staging settings
	sh bin/staging

standard: ## Run linter with auto fix
	npm run lint

