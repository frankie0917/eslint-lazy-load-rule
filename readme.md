# Eslint-plugin-lazy-load

Gives warning when lazy loading is possible (lazy-load-rule)

When load time is important factor of your frontend application,
you can use this rule to warn you whenever lazy loading is possible.

## Installation

```sh
npm install -D eslint-plugin-lazy-load
yarn add -D eslint-plugin-lazy-load
```

## Usage

In your eslint config

```json
{
  "plugins": [
    "lazy-load"
  ],
  "rules": {
    "lazy-load/use-lazy-loading": "warn"
  },
}
```

## Rule Details

This rule aims to help eliminate any lazy-loadable code that is not lazy-loaded.

Examples of **incorrect** code for this rule:

```js
import {foo} from 'foo';
if(true) foo();
```

Examples of **correct** code for this rule:
Currently allows to use in logical statement or conditional statement;

```js
import {foo} from 'foo';
true || foo();
true && foo();
true ? foo() : '';
true ? '' : foo();
```

## Further Reading

Best to use with `max-line` and `max-line-per-function` for reminding youself to put excess code in different module.
