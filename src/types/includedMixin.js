/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var cssmin = require('cssmin');
var utilities = require('../utilities');
var parsers = require('../parsers');
var equals = require("../equals");

function IncludedMixin(file, call) {
  this.file = file;
  this.call = wrapIncludedMixin(call);
}

function wrapIncludedMixin(call) {
  return ".test{@include " + call + "}";
}

function unwrapIncludedMixin(css) {
  return css.replace(".test{", "").replace("}", "");
}

function wrapIncludedOutput(css) {
  return cssmin(".test{" + css + "}");
}

IncludedMixin.prototype = {
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
    return equals(css, wrapIncludedOutput(output));
  },

  calls: function(mixin) {
    var css = utilities.createCss(this.file, this.call);
    var mixinCss = utilities.createCss(this.file, wrapIncludedMixin(mixin));
    return css.indexOf(unwrapIncludedMixin(mixinCss)) > -1;
  }
};

module.exports = IncludedMixin;
