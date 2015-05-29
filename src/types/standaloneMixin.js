/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var cssmin = require('cssmin');
var utilities = require('../utilities');
var parsers = require('../parsers');
var equals = require("../equals");

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
    return parsers.hasSelector(ast, selector);
  },

  hasNDeclarations: function(num) {
    var ast = utilities.createAst(this.file, this.call);
    return equals(parsers.countDeclarations(ast), num);
  },

  declares: function(property, value) {
    var ast = utilities.createAst(this.file, this.call);
    var declaration = parsers.findDeclaration(ast, property);
    return equals(utilities.scrubQuotes(declaration.value), value.toString());
  },

  equals: function(output) {
    var css = utilities.createCss(this.file, this.call);
    return equals(css, cssmin(output));
  },

  calls: function(mixin) {
    var css = utilities.createCss(this.file, this.call);
    var mixinCss = utilities.createCss(this.file, wrapStandaloneMixin(mixin));
    return css.indexOf(mixinCss) > -1;
  }
};

module.exports = StandaloneMixin;
