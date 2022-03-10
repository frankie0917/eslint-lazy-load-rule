/**
 * @fileoverview Gives warning when lazy loading is possible but not used
 * @author frank-tomato
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { rules } = require('./index'),
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
        import { a } from 'a';
        if (a > 8 && 6 < 'a') a();
        `,
      },
    ],
  },
  {
    name: 'should not report when idetifier is whthin conditional statement',
    valid: [
      {
        code: `
        import { a } from 'a';
        true ? a() : false;
        `,
      },
    ],
  },
  {
    name: 'should not report when idetifier is whthin logical statement',
    valid: [
      {
        code: `
        import { a } from 'a';
        a && a();
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
  {
    name: "should not report when idetifier appears whthin both if's consequent & alternate statement",
    valid: [
      {
        code: `
        import {a} from 'a';
        if(true){
          a();
        }else{
          a();
        }
        `,
      },
    ],
  },
  {
    name: 'should not report when valid idetifier share the same import as invalid idetifier',
    valid: [
      {
        code: `
        import {a, b} from 'a';
        a()
        if(true) b();
        `,
      },
    ],
  },
];

testCases.forEach((c) => {
  ruleTester.run(c.name, rules['use-lazy-loading'], {
    invalid: [],
    valid: [],
    ...c,
  });
});
