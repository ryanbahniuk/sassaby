/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var equals = require("../equals");
var utilities = require('../utilities');

function wrapFunction(call) {
  return ".test{content:" + call + "}";
}

function wrapWithTruthyFunction(call) {
  return sassTruthy() + wrapFunction("truthy(" + call + ")");
}

function sassTruthy() {
  return "@function truthy($value) { @if $value { @return true } @else { @return false } }";
}

function Func(file, call) {
  this.file = file;
  this.call = call;
}

Func.prototype = {
  equals: function(result) {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    return equals(css, wrapFunction(result));
  },

  isTrue: function() {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    return equals(css, wrapFunction(true));
  },

  isFalse: function() {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    return equals(css, wrapFunction(false));
  },

  isTruthy: function() {
    var css = utilities.createCss(this.file, wrapWithTruthyFunction(this.call));
    return equals(css, wrapFunction(true));
  },

  isFalsey: function() {
    var css = utilities.createCss(this.file, wrapWithTruthyFunction(this.call));
    return equals(css, wrapFunction(false));
  }
};

module.exports = Func;
