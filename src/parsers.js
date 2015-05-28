'use strict';

var Parsers = {
  countDeclarations: function(ast) {
    return ast.stylesheet.rules[0].declarations.length;
  },

  findDeclaration: function(ast, property) {
    var found;

    ast.stylesheet.rules.forEach(function(rule) {
      rule.declarations.forEach(function(declaration) {
        if (declaration.property === property) {
          found = declaration;
        }
      });
    });
    return found;
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
