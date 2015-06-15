'use strict';

var assert = require('assert');
var utilities = require('./utilities');

function wrapFunctionWithArgs(call, args) {
  var argString = utilities.concatArgs(args);
  return wrapFunction(call + '(' + argString + ')');
}

function wrapTruthyFunctionWithArgs(call, args) {
  var argString = utilities.concatArgs(args);
  return sassTruthy() + wrapFunction('truthy(' + call + '(' + argString + '))');
}

function wrapTruthyFunction(call) {
  return sassTruthy() + wrapFunction('truthy(' + call + ')');
}

function wrapFunction(call) {
  return '.test{content:' + call + '}';
}

function sassTruthy() {
  return '@function truthy($value) { @if $value { @return true } @else { @return false } }';
}

function compileCss(file, call, args) {
  if (args && args.length > 0) {
    return utilities.createCss(file, wrapFunctionWithArgs(call, args));
  } else {
    return utilities.createCss(file, wrapFunction(call));
  }
}

function compileTruthyCss(file, call, args) {
  if (args && args.length > 0) {
    return utilities.createCss(file, wrapTruthyFunctionWithArgs(call, args));
  } else {
    return utilities.createCss(file, wrapTruthyFunction(call));
  }
}

function FuncResult(file, call, args) {
  this.css = compileCss(file, call, args);
  this.truthyCss = compileTruthyCss(file, call, args);
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
  FuncResult.wrapTruthyFunctionWithArgs = wrapTruthyFunctionWithArgs;
  FuncResult.wrapTruthyFunction = wrapTruthyFunction;
  FuncResult.wrapFunction = wrapFunction;
  FuncResult.sassTruthy = sassTruthy;
  FuncResult.compileCss = compileCss;
  FuncResult.compileTruthyCss = compileTruthyCss;
}

module.exports = FuncResult;
