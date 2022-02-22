/**
 * @fileoverview Gives warning when lazy loading is possible but not used
 * @author frank-tomato
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  rules: {
    'use-lazy-loading': {
      create(ctx) {
        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        const identifiers = [];
        const optinalMap = {};
        return {
          // visitor functions for different types of nodes
          ImportSpecifier: (node) => identifiers.push(node.local.name),
          ImportNamespaceSpecifier: (node) => identifiers.push(node.local.name),
          ImportDefaultSpecifier: (node) => identifiers.push(node.local.name),
          Identifier: (node) => {
            if (
              [
                'ImportSpecifier',
                'ImportDefaultSpecifier',
                'ImportNamespaceSpecifier',
              ].includes(node.parent.type) ||
              !identifiers.includes(node.name)
            )
              return;
            const ancestors = ctx.getAncestors();
            const isOptional =
              ancestors.find((anc) => {
                switch (anc.type) {
                  case 'IfStatement':
                    const testTokens = ctx.getSourceCode().getTokens(anc.test);
                    for (const token of testTokens) {
                      if (
                        token.type === 'Identifier' &&
                        token.value === node.name
                      )
                        return false;
                    }
                    return true;
                  default:
                    break;
                }
                return false;
              }) !== undefined;
            if (optinalMap[node.name] === undefined) {
              optinalMap[node.name] = { value: isOptional, nodes: [node] };
              return;
            }
            if (optinalMap[node.name].value === false) return;
            optinalMap[node.name].value = isOptional;
            optinalMap[node.name].nodes.push(node);
          },
          onCodePathEnd: () => {
            Object.values(optinalMap).forEach((item) => {
              if (item.value === false) return;
              item.nodes.forEach((node) => {
                ctx.report({
                  node,
                  message: 'Consider using lazy loading',
                });
              });
            });
          },
        };
      },
    },
  },
};
