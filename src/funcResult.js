'use strict';

var assert = require('assert');
var utilities = require('./utilities');

function wrapFunctionWithArgs(call, args) {
  var argString = utilities.concatArgs(args);
  return wrapFunction(call + '(' + argString + ')');
}

function wrapFunctionWithTruthy(call, args) {
  var argString = utilities.concatArgs(args);
  return sassTruthy() + wrapFunction('truthy(' + call + '(' + argString + '))');
}

function wrapFunction(call) {
  return '.test{content:' + call + '}';
}

function sassTruthy() {
  return '@function truthy($value) { @if $value { @return true } @else { @return false } }';
}


function FuncResult(file, call, args) {
  this.css = utilities.createCss(file, wrapFunctionWithArgs(call, args));
  this.truthyCss = utilities.createCss(file, wrapFunctionWithTruthy(call, args));
}

FuncResult.prototype = {
  equals: function(result) {
    var message = 'Function: ' + this.call + ' does not equal ' + result + '.';
    assert.equal(this.css, wrapFunction(result), message);
  },

  doesNotEqual: function(result) {
    var message = 'Function: ' + this.call + ' equals ' + result + '.';
    assert.notEqual(this.css, wrapFunction(result), message);
  },

  isTrue: function() {
    var message = 'Function does not equal true.';
    assert.equal(this.css, wrapFunction(true), message);
  },

  isFalse: function() {
    var message = 'Function does not equal false.';
    assert.equal(this.css, wrapFunction(false), message);
  },

  isTruthy: function() {
    var message = 'Function is not truthy.';
    assert.equal(this.truthyCss, wrapFunction(true), message);
  },

  isFalsy: function() {
    var message = 'Function is not falsy.';
    assert.equal(this.truthyCss, wrapFunction(false), message);
  }
};

if (process.env.NODE_ENV === 'test') {
  FuncResult.wrapFunctionWithArgs = wrapFunctionWithArgs;
  FuncResult.wrapFunctionWithTruthy = wrapFunctionWithTruthy;
  FuncResult.wrapFunction = wrapFunction;
  FuncResult.sassTruthy = sassTruthy;
}

module.exports = FuncResult;
