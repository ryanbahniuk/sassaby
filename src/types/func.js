/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var assert = require('assert');
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
    var message = "Function: " + this.call + " does not equal " + result + ".";
    assert.equal(css, wrapFunction(result), message);
  },

  doesNotEqual: function(result) {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    var message = "Function: " + this.call + " equals " + result + ".";
    assert.notEqual(css, wrapFunction(result), message);
  },

  isTrue: function() {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    var message = "Function does not equal true.";
    assert.equal(css, wrapFunction(true), message);
  },

  isFalse: function() {
    var css = utilities.createCss(this.file, wrapFunction(this.call));
    var message = "Function does not equal false.";
    assert.equal(css, wrapFunction(false), message);
  },

  isTruthy: function() {
    var css = utilities.createCss(this.file, wrapWithTruthyFunction(this.call));
    var message = "Function is not truthy.";
    assert.equal(css, wrapFunction(true), message);
  },

  isFalsy: function() {
    var css = utilities.createCss(this.file, wrapWithTruthyFunction(this.call));
    var message = "Function is not falsy.";
    assert.equal(css, wrapFunction(false), message);
  }
};

if (process.env.NODE_ENV === 'test') {
  Func.wrapFunction = wrapFunction;
  Func.wrapWithTruthyFunction = wrapWithTruthyFunction;
  Func.sassTruthy = sassTruthy;
}

module.exports = Func;
