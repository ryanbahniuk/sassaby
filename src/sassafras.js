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

function createCss(file, call) {
  return cssmin(compileWithFile(file, call));
}

function createAst(file, call) {
  return css.parse(createCss(file, call));
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

function IncludedMixin(file, call) {
  this.file = file;
  this.call = wrapIncludedMixin(call);
}

IncludedMixin.prototype = {
  hasNDeclarations: function(num) {
    var ast = createAst(this.file, this.call);
    assert.equal(countDeclarations(ast), num);
  },

  includesDeclaration: function(property, value) {
    var ast = createAst(this.file, this.call);
    var declaration = findDeclaration(ast, property);
    assert.equal(scrubQuotes(declaration.value), value);
  },

  equals: function(output) {
    var css = createCss(this.file, this.call);
    assert.equal(css, wrapIncludedOutput(output));
  }
};

function StandaloneMixin(file, call) {
  this.file = file;
  this.call = wrapStandaloneMixin(call);
}

StandaloneMixin.prototype = {
  createsSelector: function(selector) {
    var ast = createAst(this.file, this.call);
    assert(hasSelector(ast, selector));
  }
};

function Fnction(file, call) {
  this.file = file;
  this.call = wrapFunction(call);
}

Fnction.prototype = {
  equals: function(result) {
    var css = createCss(this.file, this.call);
    assert.equal(css, wrapFunction(result));
  }
};

var Sassafras = {
  file: null,

  setFile: function(file) {
    this.file = file;
  },

  includedMixin: function(call) {
    return new IncludedMixin(Sassafras.file, call);
  },

  standaloneMixin: function(call) {
    return new StandaloneMixin(Sassafras.file, call);
  },

  fnction: function(call) {
    return new Fnction(Sassafras.file, call);
  }

};

module.exports = Sassafras;
