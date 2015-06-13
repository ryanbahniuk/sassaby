'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');

function MockFuncResult(file, call, args) {
  this.file = file;
  this.call = call;
  this.args = args;
}

describe('Func', function() {
  var Func;
  var func;

  var variables = '$test:5;';
  var dependencies = "@import 'file';";
  var file = '@function test($input) { @return 2 * $input }';
  var call = 'test(5)';

  beforeEach(function() {
    Func = proxyquire('../src/types/func', {
      '../funcResult': MockFuncResult
    });
    func = new Func(variables, dependencies, file, call);
  });

  describe('new', function() {
    it('should set file and call from the arguments', function() {
      assert.equal(func.file, variables + dependencies + file);
      assert.equal(func.call, call);
    });
  });

  describe('called', function() {
    it('should return a new funcResult', function() {
      var result = func.called();
      assert(result instanceof MockFuncResult);
    });

    it('should have the correct properties', function() {
      var result = func.called();
      assert.equal(result.file, variables + dependencies + file);
      assert.equal(result.call, call);
      assert.equal(result.args, undefined);
    });
  });

  describe('calledWith', function() {
    it('should return a new funcResult', function() {
      var result = func.calledWith(1, 2, 'hello', true);
      assert(result instanceof MockFuncResult);
    });

    it('should have the correct properties', function() {
      var result = func.calledWith(1, 2, 'hello', true);
      assert.equal(result.file, variables + dependencies + file);
      assert.equal(result.call, call);
      assert.deepEqual(result.args, [1, 2, 'hello', true]);
    });
  });
});
