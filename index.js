/**
 * @fileoverview Gives warning when lazy loading is possible but not used
 * @author frank-tomato
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  rules: {
    /**
     * @type {import('eslint').Rule.RuleModule}
     */
    'use-lazy-loading': {
      create(ctx) {
        const identifiers = [];
        /**record identifier and is it optional throughout the file
         * - key: identifier
         * - value: is it optional for every identifier
         */
        const optionalMap = {};
        /**record identifier and it's import source
         * - key: every imported identifier
         * - value: the import source of said identifier
         * */
        const importSourceMap = {};
        /**is particular import source optional throughout the file
         * - key: import source
         * - value: is it optional for every import source
         */
        const isImportSourceOptionalMap = {};
        let hasReport = false;
        const addIdentifier = (node) => {
          identifiers.push(node.local.name);
          importSourceMap[node.local.name] = node.parent.source.value;
          isImportSourceOptionalMap[node.parent.source.value] = true;
        };
        return {
          // visitor functions for different types of nodes
          ImportSpecifier: (node) => addIdentifier(node),
          ImportNamespaceSpecifier: (node) => addIdentifier(node),
          ImportDefaultSpecifier: (node) => addIdentifier(node),
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
                    if (anc.alternate === null) return true;

                    const isInConsequent =
                      ctx
                        .getSourceCode()
                        .getTokens(anc.consequent)
                        .findIndex(
                          (it) =>
                            it.type === 'Identifier' && it.value === node.name,
                        ) !== -1;
                    const isInAlternate =
                      ctx
                        .getSourceCode()
                        .getTokens(anc.alternate)
                        .findIndex(
                          (it) =>
                            it.type === 'Identifier' && it.value === node.name,
                        ) !== -1;
                    if (isInConsequent && isInAlternate) return false;
                    return true;
                  default:
                    break;
                }

                return false;
              }) !== undefined;
            if (!isOptional)
              isImportSourceOptionalMap[importSourceMap[node.name]] = false;
            if (optionalMap[node.name] === undefined) {
              optionalMap[node.name] = { value: isOptional, nodes: [node] };
              return;
            }
            if (optionalMap[node.name].value === false) return;
            optionalMap[node.name].value = isOptional;
            optionalMap[node.name].nodes.push(node);
          },
          onCodePathEnd: () => {
            if (hasReport) return;
            hasReport = true;

            Object.values(optionalMap).forEach((item) => {
              if (item.value === false) return;
              item.nodes.forEach((node) => {
                if (!isImportSourceOptionalMap[importSourceMap[node.name]])
                  return;
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
