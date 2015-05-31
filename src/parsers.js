'use strict';

var Parsers = {
  countDeclarations: function(ast) {
    if (ast.stylesheet && ast.stylesheet.rules && ast.stylesheet.rules[0].declarations) {
      return ast.stylesheet.rules[0].declarations.length;
    } else {
      return 0;
    }
  },

  findDeclaration: function(ast, property) {
    var found = [];

    ast.stylesheet.rules.forEach(function(rule) {
      rule.declarations.forEach(function(declaration) {
        if (declaration.property === property) {
          found.push(declaration);
        }
      });
    });
    return found[0];
  },

  hasSelector: function(ast, selectorValue) {
    var found = false;

    ast.stylesheet.rules.forEach(function(rule) {
      rule.selectors.forEach(function(selector) {
        if (selector === selectorValue) {
          found = true;
        }
      });
    });
    return found;
  }
};

module.exports = Parsers;
