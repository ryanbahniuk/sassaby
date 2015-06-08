'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var utilities = require('../src/utilities');

var FuncResult;
var funcResult;
var funcTrueResult;
var funcFalseResult;
var mockUtilities;

var file = '@function test($input) { @return 2 * $input }';
var call = 'test';
var args = [5];
var argString = '5';
var result = '10';
var wrappedResult = '.test{content:' + result + '}';
var wrappedTrueResult = '.test{content:true}';
var wrappedFalseResult = '.test{content:false}';

describe('FuncResult', function() {
  beforeEach(function() {
    FuncResult = proxyquire('../src/funcResult', {
      './utilities': utilities
    });

    mockUtilities = sinon.mock(utilities);

    mockUtilities.expects('createCss').withArgs(file, FuncResult.wrapFunctionWithArgs(call, args)).returns(wrappedResult);
    mockUtilities.expects('createCss').withArgs(file, FuncResult.wrapFunctionWithTruthy(call, args)).returns(wrappedTrueResult);
    funcResult = new FuncResult(file, call, args);
    mockUtilities.expects('createCss').withArgs(file, FuncResult.wrapFunctionWithArgs(call, args)).returns(wrappedTrueResult);
    mockUtilities.expects('createCss').withArgs(file, FuncResult.wrapFunctionWithTruthy(call, args)).returns(wrappedTrueResult);
    funcTrueResult = new FuncResult(file, call, args);
    mockUtilities.expects('createCss').withArgs(file, FuncResult.wrapFunctionWithArgs(call, args)).returns(wrappedFalseResult);
    mockUtilities.expects('createCss').withArgs(file, FuncResult.wrapFunctionWithTruthy(call, args)).returns(wrappedFalseResult);
    funcFalseResult = new FuncResult(file, call, args);
  });

  afterEach(function() {
    mockUtilities.restore();
  });

  describe('wrapFunctionWithArgs', function() {
    it('wraps the function and args with the necessary SCSS to not fail the compiler', function() {
      mockUtilities.expects('concatArgs').withArgs(args).returns(argString);
      assert.equal(FuncResult.wrapFunctionWithArgs(call, args), '.test{content:' + call + '(' + argString + ')}');
    });
  });

  describe('wrapFunctionWithTruthy', function() {
    it('wraps the function and truthy with the necessary SCSS to not fail the compiler', function() {
      mockUtilities.expects('concatArgs').withArgs(args).returns(argString);
      assert.equal(FuncResult.wrapFunctionWithTruthy(call, args), FuncResult.sassTruthy() + FuncResult.wrapFunction("truthy(" + call + '(' + argString + '))'));
    });
  });

  describe('wrapFunction', function() {
    it('wraps the function with the necessary SCSS to not fail the compiler', function() {
      assert.equal(FuncResult.wrapFunction(call), '.test{content:' + call + '}');
    });
  });

  describe('sassTruthy', function() {
    it('returns the sass truthy function as a string', function() {
      assert.equal(FuncResult.sassTruthy(), '@function truthy($value) { @if $value { @return true } @else { @return false } }');
    });
  });

  describe('new', function() {
    it('should set file and call from the arguments', function() {
      assert.equal(funcResult.css, wrappedResult);
      assert.equal(funcResult.truthyCss, wrappedTrueResult);
    });
  });

  describe('equals', function() {
    it('should not throw an error if the output matches the input', function() {
      funcResult.equals(result);
    });

    it('throws an error if the output does not match the input', function() {
      assert.throws(function() { funcResult.equals(20); });
    });
  });

  describe('doesNotEqual', function() {
    it('should not throw an error if the output does not match the input', function() {
      funcResult.doesNotEqual(20);
    });

    it('throws an error if the output does input', function() {
      assert.throws(function() {
        funcResult.doesNotEqual(result);
      });
    });
  });

  describe('isTrue', function() {
    it('should not throw an error if the output is true', function() {
      funcTrueResult.isTrue();
    });

    it('throws an error if the output is not true', function() {
      assert.throws(function() {
        funcFalseResult.isTrue();
      });
    });
  });

  describe('isFalse', function() {
    it('should not throw an error if the output is false', function() {
      funcFalseResult.isFalse();
    });

    it('throws an error if the output is not false', function() {
      assert.throws(function() {
        funcTrueResult.isFalse();
      });
    });
  });

  describe('isTruthy', function() {
    it('should not throw an error if the output is truthy', function() {
      funcTrueResult.isTruthy();
    });

    it('throws an error if the output is not truthy', function() {
      assert.throws(function() {
        funcFalseResult.isTruthy();
      });
    });
  });

  describe('isFalsy', function() {
    it('should not throw an error if the output is falsy', function() {
      funcFalseResult.isFalsy();
    });

    it('throws an error if the output is not falsy', function() {
      assert.throws(function() {
        funcTrueResult.isFalsy();
      });
    });
  });
});
