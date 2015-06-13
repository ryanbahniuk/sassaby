'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');

function MockMixinResult(type, file, call, args, block) {
  this.type = type;
  this.file = file;
  this.call = call;
  this.args = args;
  this.block = block;
}


describe('Mixin', function() {
  var Mixin;
  var mixin;

  var type = 'test';
  var variables = '$test:5;';
  var dependencies = "@import 'file';";
  var file = '@mixin test($input) { color: $input }';
  var call = '@include test(red)';

  beforeEach(function() {
    Mixin = proxyquire('../src/types/mixin', {
      '../mixinResult': MockMixinResult
    });
    mixin = new Mixin(type, variables, dependencies, file, call);
  });

  describe('new', function() {
    it('should set type, file, and call from the arguments', function() {
      assert.equal(mixin.type, type);
      assert.equal(mixin.file, variables + dependencies + file);
      assert.equal(mixin.call, call);
    });
  });

  describe('called', function() {
    it('should return a new mixinResult', function() {
      var result = mixin.called();
      assert(result instanceof MockMixinResult);
    });

    it('should have the correct properties', function() {
      var result = mixin.called();
      assert.equal(result.type, type);
      assert.equal(result.file, variables + dependencies + file);
      assert.equal(result.call, call);
      assert.deepEqual(result.args, undefined);
      assert.equal(result.block, undefined);
    });
  });

  describe('calledWith', function() {
    it('should return a new mixinResult', function() {
      var result = mixin.calledWith(1, 2, 'hello', true);
      assert(result instanceof MockMixinResult);
    });

    it('should have the correct properties', function() {
      var result = mixin.calledWith(1, 2, 'hello', true);
      assert.equal(result.type, type);
      assert.equal(result.file, variables + dependencies + file);
      assert.equal(result.call, call);
      assert.deepEqual(result.args, [1, 2, 'hello', true]);
      assert.equal(result.block, undefined);
    });
  });

  describe('calledWithArgs', function() {
    it('should return a new mixinResult', function() {
      var result = mixin.calledWithArgs(1, 2, 'hello', true);
      assert(result instanceof MockMixinResult);
    });

    it('should have the correct properties', function() {
      var result = mixin.calledWithArgs(1, 2, 'hello', true);
      assert.equal(result.type, type);
      assert.equal(result.file, variables + dependencies + file);
      assert.equal(result.call, call);
      assert.deepEqual(result.args, [1, 2, 'hello', true]);
      assert.equal(result.block, undefined);
    });
  });

  describe('calledWithBlock', function() {
    var block = 'color: red;';

    it('should return a new mixinResult', function() {
      var result = mixin.calledWithBlock(block);
      assert(result instanceof MockMixinResult);
    });

    it('should have the correct properties', function() {
      var result = mixin.calledWithBlock(block);
      assert.equal(result.type, type);
      assert.equal(result.file, variables + dependencies + file);
      assert.equal(result.call, call);
      assert.deepEqual(result.args, undefined);
      assert.equal(result.block, block);
    });
  });

  describe('calledWithBlockAndArgs', function() {
    var block = 'color: red;';

    it('should return a new mixinResult', function() {
      var result = mixin.calledWithBlockAndArgs(block, 1, 2, 'hello', true);
      assert(result instanceof MockMixinResult);
    });

    it('should have the correct properties', function() {
      var result = mixin.calledWithBlockAndArgs(block, 1, 2, 'hello', true);
      assert.equal(result.type, type);
      assert.equal(result.file, variables + dependencies + file);
      assert.equal(result.call, call);
      assert.deepEqual(result.args, [1, 2, 'hello', true]);
      assert.equal(result.block, block);
    });
  });
});
