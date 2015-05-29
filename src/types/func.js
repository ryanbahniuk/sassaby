'use strict';

var assert = require("assert");
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
    assert.equal(css, wrapFunction(result));
  },

  isTrue: function() {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    assert.equal(css, wrapFunction(true));
  },

  isFalse: function() {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    assert.equal(css, wrapFunction(false));
  },

  isTruthy: function() {
    var css = utilities.createCss(this.file, wrapWithTruthyFunction(this.call));
    assert.equal(css, wrapFunction(true));
  },

  isFalsey: function() {
    var css = utilities.createCss(this.file, wrapWithTruthyFunction(this.call));
    assert.equal(css, wrapFunction(false));
  }
};

module.exports = Func;
