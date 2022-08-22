# Contributing to JSON-Logic

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [What should I know before I get started?](#what-should-i-know-before-i-get-started)
  - [Documentation](#documentation)
  - [API](#api)
- [How to contribute code?](#how-to-contribute-code)
  - [Build](#build)
  - [Development tools](#development-tools)
- [Testing](#testing)
- [Styleguides](#styleguides)
  - [JavaScript](#javascript)
  - [Git Commit Messages](#git-commit-messages)
  - [Editors](#editors)
- [CI/CD](#cicd)
  - [Git Hooks](#git-hooks)
  - [Travis](#travis)
- [Releasing a new version](#releasing-a-new-version)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# What should I know before I get started?

- [`JsonLogic`](http://jsonlogic.com/)

## Documentation

This project is documented with markdown for users in [`README.md`](./README.md) and authors in 
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

The **API documentation** is genrated by [`@adobe/jsonschema2md`](https://github.com/adobe/jsonschema2md#readme) and can be found at [`./docs#readme`](./docs#readme).
Simply run `npm run docs` to create it.

A [`CHANGELOG.md`](./CHANGELOG.md) is automatically generated based upon [**Conventional Commits**](https://www.conventionalcommits.org/).

A *Table of Contents* is automatically generated for both [`README.md`](./README.md) and [`CONTRIBUTING.md`](./CONTRIBUTING.md) by utilising [`doctoc`](https://github.com/thlorenz/doctoc#readme).

You can also run `npm run toc` to manually trigger an update.

## API

The whole API is specified with [**JSON Schema**](https://json-schema.org/).

All schema files can be found in [`./schemas`](./schemas) and are validated by [`ajv`](https://ajv.js.org/) - simply run `npm run lint:schemas`.

# How to contribute code?

If you want/need to make changes to this package please open a Pull-Request.

## Build

Simply run `npm run build`.

## Development tools

- [rollup](https://rollupjs.org/)
- [Babel](https://babeljs.io/)
- [browserlist](https://github.com/browserslist/browserslist)
- [NPM](https://docs.npmjs.com/)
- [Git](https://git-scm.com/)

# Testing

Run [`npm test`](https://docs.npmjs.com/cli/test.html) to execute unit tests.

All test fixtures are downloaded from:
- http://jsonlogic.com/tests.json
- http://jsonlogic.com/rule_like.json

This package is using [`qunit`](https://qunitjs.com/) to write tests.

# Styleguides

## JavaScript

JavaScript is linted and autoformatted by a combination of [`prettier`](https://prettier.io/) and [`eslint`](https://eslint.org/).

We extend [**Airbnb's JavaScript Styleguide**](https://github.com/airbnb/javascript#readme) available as [`eslint-config-airbnb-base`](https://www.npmjs.com/package/eslint-config-airbnb-base).

## Git Commit Messages

This project utilizes [`commitlint`](https://commitlint.js.org/) to enforce [**Conventional Commits**](https://www.conventionalcommits.org/).

These rules form the basis for our [`CHANGELOG.md`](./CHANGELOG.md) and automatic versioning of releases.

## Editors

Basic configuration for various editors is provided by an [`editorconfig`](https://editorconfig.org/) file.

# CI/CD

## Git Hooks

We use [`husky`](https://github.com/typicode/husky#readme) and [`lintstaged`](https://github.com/okonet/lint-staged#readme) to enforce those styleguide rules for each commit.

## Travis

[**Travis CI**](https://travis-ci.org/) is configured to lint source files, run all tests and run a build to check pull requests.

# Releasing a new version

We stick to [**semantic versioning**](https://semver.org/) and use [`semantic-release`](https://semantic-release.gitbook.io/semantic-release/) to automatically generate a valid version, a [`CHANGELOG.md`](./CHANGELOG.md) and to [`publish`](https://docs.npmjs.com/cli/publish) a new version to NPM [here](https://www.npmjs.com/package/@axa-ch/aletheia-zoid).

Simply run `npm run release`.
