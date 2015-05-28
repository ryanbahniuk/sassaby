'use strict';

var assert = require("assert");
var cssmin = require('cssmin');
var utilities = require('./utilities');
var parsers = require('./parsers');

function IncludedMixin(file, call) {
  this.file = file;
  this.call = wrapIncludedMixin(call);
}

function wrapIncludedMixin(call) {
  return ".test{@include " + call + "}";
}

function wrapIncludedOutput(css) {
  return cssmin(".test{" + css + "}");
}

IncludedMixin.prototype = {
  hasNDeclarations: function(num) {
    var ast = utilities.createAst(this.file, this.call);
    assert.equal(parsers.countDeclarations(ast), num);
  },

  includesDeclaration: function(property, value) {
    var ast = utilities.createAst(this.file, this.call);
    var declaration = parsers.findDeclaration(ast, property);
    assert.equal(utilities.scrubQuotes(declaration.value), value);
  },

  equals: function(output) {
    var css = utilities.createCss(this.file, this.call);
    assert.equal(css, wrapIncludedOutput(output));
  }
};

module.exports = IncludedMixin;
