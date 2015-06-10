'use strict';

var querystring = require('querystring');

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
      if (rule.selectors) {
        rule.selectors.forEach(function(selector) {
          if (selector === selectorValue) {
            found = true;
          }
        });
      }
    });

    return found;
  },

  hasFontFace: function(ast) {
    var found = false;

    ast.stylesheet.rules.forEach(function(rule) {
      if (rule.type === 'font-face') {
        found = true;
      }
    });

    return found;
  },

  hasImport: function(sass, importName) {
    var pattern = new RegExp('@import[^;]*[\'\"]' + querystring.escape(importName) + '[\'\"].*;');
    return !!sass.match(pattern);
  }
};

module.exports = Parsers;
