'use strict';

function escapeCharacters(string) {
  var specials = ['/', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}'];
  var pattern = '([' + specials.join('') + '])';
  var re = new RegExp(pattern, 'g');
  return string.replace(re, '\\$1');
}

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

  findMedia: function(ast) {
    var found = [];

    ast.stylesheet.rules.forEach(function(rule) {
      if (rule.type === 'media') {
        found.push(rule);
      }
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
    var pattern = new RegExp('@import[^;]*[\'\"]' + escapeCharacters(importName) + '[\'\"].*;');
    return !!sass.match(pattern);
  }
};

if (process.env.NODE_ENV === 'test') {
  Parsers.escapeCharacters = escapeCharacters;
}

module.exports = Parsers;
