'use strict';

var assert = require("assert");
var sass = require('node-sass');
var fs = require('fs');
var css = require('css');

function compileFromString(string, callback) {
  var s = sass.renderSync({data: string}, callback);
  return s.css.toString();
}

function compileWithFile(file, string, callback) {
  var mixins = fs.readFileSync(file).toString();
  var stringWithImport = mixins + string;
  return compileFromString(stringWithImport, callback);
}

function checkError(err, data) {
  if (err) { throw err; }
}

function countDeclarations(ast) {
  return ast.stylesheet.rules[0].declarations.length;
}

function findDeclaration(ast, property) {
  var found;

  ast.stylesheet.rules.forEach(function(rule) {
    rule.declarations.forEach(function(declaration) {
      if (declaration.property === property) {
        found = declaration;
      }
    });
  });
  return found;
}

function hasSelector(ast, selectorValue) {
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

function scrubQuotes(string) {
  return string.replace(/["']/g, "");
}

var Sassafras = {
  file: null,
  call: null,

  setFile: function(file) {
    this.file = file;
  },

  setCall: function(call) {
    this.call = call;
  },

  createAst: function() {
    var compiled = compileWithFile(this.file, this.call);
    return css.parse(compiled);
  },

  assertDeclarationsNumber: function(num) {
    var ast = this.createAst();
    assert.equal(countDeclarations(ast), num);
  },

  assertDeclaration: function(property, value) {
    var ast = this.createAst();
    var declaration = findDeclaration(ast, property);
    assert.equal(scrubQuotes(declaration.value), value);
  },

  assertSelectorCreation: function(selector) {
    var ast = this.createAst();
    assert(hasSelector(ast, selector));
  }
};

module.exports = Sassafras;
