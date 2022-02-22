/**
 * @fileoverview Gives warning when lazy loading is possible but not used
 * @author frank-tomato
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('.'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

const testCases = [
  {
    name: 'should not report when idetifier is not a imported identifier',
    valid: [
      {
        code: `
    const a = ()=>{};
    true && a();
    `,
      },
    ],
  },
  {
    name: 'should not report when idetifier is whthin if test statement',
    valid: [
      {
        code: `
        import { foo } from './foo';
        if (foo > 8 && 6 < 'foo') foo();
        `,
      },
    ],
  },
  {
    name: 'should not report when idetifier is whthin conditional statement',
    valid: [
      {
        code: `
        import { foo } from './foo';
        true ? foo() : false;
        `,
      },
    ],
  },
  {
    name: 'should not report when idetifier is whthin logical statement',
    valid: [
      {
        code: `
        import { foo } from './foo';
        foo && foo();
        `,
      },
    ],
  },
  {
    name: 'should report when idetifier is whthin if statement',
    invalid: [
      {
        code: `
        import {a} from 'a';
        if(true) a();
        `,
        errors: [{ message: 'Consider using lazy loading' }],
      },
    ],
  },
];

testCases.forEach((c) => {
  ruleTester.run(c.name, rule, { invalid: [], valid: [], ...c });
});
