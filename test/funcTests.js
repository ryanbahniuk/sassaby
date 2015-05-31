/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var utilities = require('../src/utilities');

var Func;
var func;
var mockUtilities;

var file = '@function test($input) { @return 2 * $input }';
var call = 'test(5)';
var result = '10';

describe('Func', function() {
  beforeEach(function() {
    Func = proxyquire('../src/types/func', {
      '../utilities': utilities
    });
    func = new Func(file, call);
    mockUtilities = sinon.mock(utilities);
  });

  afterEach(function() {
    mockUtilities.restore();
  });

  describe('wrapFunction', function() {
    it('wrap the function with the necessary SCSS to not fail the compiler', function() {
      assert.equal(Func.wrapFunction(call), ".test{content:" + call + "}");
    });
  });

  describe('wrapWithTruthyFunction', function() {
    it('wrap the function with the necessary SCSS to not fail the compiler', function() {
      assert.equal(Func.wrapWithTruthyFunction(call), Func.sassTruthy() + Func.wrapFunction("truthy(" + call + ")"));
    });
  });

  describe('sassTruthy', function() {
    it('returns the sass truthy function as a string', function() {
      assert.equal(Func.sassTruthy(), "@function truthy($value) { @if $value { @return true } @else { @return false } }");
    });
  });

  describe('new', function() {
    it('should set file and call from the arguments', function() {
      assert.equal(func.file, file);
      assert.equal(func.call, call);
    });
  });

  describe('equals', function() {
    it('should not throw an error if the output matches the input', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapFunction(call)).returns(Func.wrapFunction(result));
      func.equals(result);
    });

    it('throws an error if the output does not match the input', function() {
      assert.throws(function() { func.equals(20); });
    });
  });

  describe('doesNotEqual', function() {
    it('should not throw an error if the output does not match the input', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapFunction(call)).returns(Func.wrapFunction(20));
      func.doesNotEqual(result);
    });

    it('throws an error if the output does input', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapFunction(call)).returns(Func.wrapFunction(result));
      assert.throws(function() {
        func.doesNotEqual(result);
      });
    });
  });

  describe('isTrue', function() {
    it('should not throw an error if the output is true', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapFunction(call)).returns(Func.wrapFunction(true));
      func.isTrue();
    });

    it('throws an error if the output is not true', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapFunction(call)).returns(Func.wrapFunction(false));
      assert.throws(function() {
        func.isTrue();
      });
    });
  });

  describe('isFalse', function() {
    it('should not throw an error if the output is false', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapFunction(call)).returns(Func.wrapFunction(false));
      func.isFalse();
    });

    it('throws an error if the output is not false', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapFunction(call)).returns(Func.wrapFunction(true));
      assert.throws(function() {
        func.isFalse();
      });
    });
  });

  describe('isTruthy', function() {
    it('should not throw an error if the output is truthy', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapWithTruthyFunction(call)).returns(Func.wrapFunction(true));
      func.isTruthy();
    });

    it('throws an error if the output is not truthy', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapWithTruthyFunction(call)).returns(Func.wrapFunction(false));
      assert.throws(function() {
        func.isTruthy();
      });
    });
  });

  describe('isFalsy', function() {
    it('should not throw an error if the output is truthy', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapWithTruthyFunction(call)).returns(Func.wrapFunction(false));
      func.isFalsy();
    });

    it('throws an error if the output is not truthy', function() {
      mockUtilities.expects('createCss').withArgs(file, Func.wrapWithTruthyFunction(call)).returns(Func.wrapFunction(true));
      assert.throws(function() {
        func.isFalsy();
      });
    });
  });
});
