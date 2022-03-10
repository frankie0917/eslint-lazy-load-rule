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
    name: 'should not report when an identifier is not an imported identifier',
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
    name: 'should not report when an identifier is within an if test statement',
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
    name: 'should not report when an identifier is within a conditional statement',
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
    name: 'should not report when an identifier is within a logical statement',
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
    name: 'should report when an identifier is within an if statement',
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
    name: "should not report when an identifier appears within both if's consequent & alternate statement",
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
    name: 'should not report when a valid identifier share the same import as an invalid identifier',
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
  {
    name: 'should not report when an invalid identifier is valid in another function',
    valid: [
      {
        code: `
        import {a} from 'a';
        const fn1 = ()=>{
          a();
        }
        const fn2 = ()=>{
          if(true) a();
        }
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
