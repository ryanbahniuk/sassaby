'use strict';

var assert = require("assert");
var cssmin = require('cssmin');
var utilities = require('../utilities');
var parsers = require('../parsers');

function wrapStandaloneMixin(call) {
  return "@include " + call + ";";
}

function StandaloneMixin(file, call) {
  this.file = file;
  this.call = wrapStandaloneMixin(call);
}

StandaloneMixin.prototype = {
  createsSelector: function(selector) {
    var ast = utilities.createAst(this.file, this.call);
    assert(parsers.hasSelector(ast, selector));
  },

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
    assert.equal(css, cssmin(output));
  }
};

module.exports = StandaloneMixin;
