'use strict';

function escapeCharacters(string) {
  var specials = ['/', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}'];
  var pattern = '([' + specials.join('') + '])';
  var re = new RegExp(pattern, 'g');
  return string.replace(re, '\\$1');
}

function hasSelectorValue(rule, selectorValue) {
  var found = false;

  if (rule.selectors) {
    rule.selectors.forEach(function(selector) {
      if (selector === selectorValue) {
        found = true;
      }
    });
  }

  return found;
}

function findDeclarationProperty(rule, declarationProperty) {
  var foundDeclaration;

  if (rule.declarations) {
    rule.declarations.forEach(function(declaration) {
      if (declaration.property === declarationProperty) {
        foundDeclaration = declaration;
      }
    });
  }

  return foundDeclaration;
}

function isFontFace(rule) {
  if (rule.type === 'font-face') {
    return true;
  }
  return false;
}

var Parsers = {
  countDeclarations: function(ast) {
    var count = 0;

    ast.stylesheet.rules.forEach(function(rule) {
      if (rule.type === 'media') {
        rule.rules.forEach(function(rule) {
          count = count + rule.declarations.length;
        });
      } else {
        count = count + rule.declarations.length;
      }
    });
    return count;
  },

  findDeclaration: function(ast, property) {
    var found;

    ast.stylesheet.rules.forEach(function(rule) {
      if (rule.type === 'media') {
        rule.rules.forEach(function(rule) {
          found = found || findDeclarationProperty(rule, property);
        });
      } else {
        found = found || findDeclarationProperty(rule, property);
      }
    });

    return found;
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
      if (rule.type === 'media') {
        rule.rules.forEach(function(rule) {
          found = found || hasSelectorValue(rule, selectorValue);
        });
      } else {
        found = found || hasSelectorValue(rule, selectorValue);
      }
    });

    return found;
  },

  hasFontFace: function(ast) {
    var found = false;

    ast.stylesheet.rules.forEach(function(rule) {
      if (rule.type === 'media') {
        rule.rules.forEach(function(rule) {
          found = found || isFontFace(rule);
        });
      } else {
        found = found || isFontFace(rule);
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
  Parsers.hasSelectorValue = hasSelectorValue;
  Parsers.findDeclarationProperty = findDeclarationProperty;
  Parsers.isFontFace = isFontFace;
}

module.exports = Parsers;
