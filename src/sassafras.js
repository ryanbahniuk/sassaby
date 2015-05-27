'use strict';

var assert = require("assert");
var sass = require('node-sass');
var fs = require('fs');
var css = require('css');
var cssmin = require('cssmin');

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

function wrapFunction(call) {
  return ".test{content:" + call + "}";
}

function wrapIncludedMixin(call) {
  return ".test{@include " + call + "}";
}

function wrapIncludedOutput(css) {
  return cssmin(".test{" + css + "}");
}

function wrapStandaloneMixin(call) {
  return "@include " + call + ";";
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

  createCss: function() {
    return cssmin(compileWithFile(this.file, this.call));
  },

  createAst: function() {
    return css.parse(this.createCss());
  },

  includedMixin: {
    assertDeclarationsNumber: function(num) {
      Sassafras.setCall(wrapIncludedMixin(Sassafras.call));
      var ast = Sassafras.createAst();
      assert.equal(countDeclarations(ast), num);
    },

    includesDeclaration: function(property, value) {
      Sassafras.setCall(wrapIncludedMixin(Sassafras.call));
      var ast = Sassafras.createAst();
      var declaration = findDeclaration(ast, property);
      assert.equal(scrubQuotes(declaration.value), value);
    },

    assertEntireOutput: function(output) {
      Sassafras.setCall(wrapIncludedMixin(Sassafras.call));
      var css = Sassafras.createCss();
      assert.equal(css, wrapIncludedOutput(output));
    },
  },

  standaloneMixin: {
    assertSelectorCreation: function(selector) {
      Sassafras.setCall(wrapStandaloneMixin(Sassafras.call));
      var ast = Sassafras.createAst();
      assert(hasSelector(ast, selector));
    }
  },

  fnction: {
    assertEqual: function(result) {
      Sassafras.setCall(wrapFunction(Sassafras.call));
      var css = Sassafras.createCss();
      assert.equal(css, wrapFunction(result));
    }
  }

};

module.exports = Sassafras;
