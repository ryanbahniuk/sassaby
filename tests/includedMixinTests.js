/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var utilities = require('../src/utilities');
var parsers = require('../src/parsers');
var ast = require('./fixtures/ast.json');

var cssmin = sinon.spy(function(input) { return input; });
var IncludedMixin = proxyquire('../src/types/IncludedMixin', {
  '../utilities': utilities,
  '../parsers': parsers,
  'cssmin': cssmin
});

var mockUtilities;
var mockParsers;
var file = '@mixin test($input) { color: $input }';
var call = '@include test(red)';
var property = 'color';
var value = 'red';
var result = property + ":" + value;
var wrappedResult = '.test{' + result + '}';
var includedMixin = new IncludedMixin(file, call);

describe('IncludedMixin', function() {
  beforeEach(function() {
    mockUtilities = sinon.mock(utilities);
    mockParsers = sinon.mock(parsers);
  });

  afterEach(function() {
    mockUtilities.restore();
    mockParsers.restore();
  });

  describe('wrapIncludedMixin', function() {
    it('wraps the function with the necessary SCSS to not fail the compiler', function() {
      assert.equal(IncludedMixin.wrapIncludedMixin(call), ".test{@include " + call + "}");
    });
  });

  describe('unwrapIncludedMixin', function() {
    it('unwraps the function with the necessary SCSS to not fail the compiler', function() {
      assert.equal(IncludedMixin.unwrapIncludedMixin(wrappedResult), result);
    });
  });

  describe('wrapIncludedOutput', function() {
    it('unwraps the function with the necessary SCSS to not fail the compiler', function() {
      assert.equal(IncludedMixin.wrapIncludedOutput(result), wrappedResult);
      cssmin.calledWith(wrappedResult);
    });
  });

  describe('new', function() {
    it('should set file and call from the arguments', function() {
      assert.equal(includedMixin.file, file);
      assert.equal(includedMixin.call, call);
    });
  });

  describe('hasNumDeclarations', function() {
    it('should not throw an error if mixin creates the given amount of declarations', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
      includedMixin.hasNumDeclarations(4);
    });

    it('should throw an error if mixin does not create the given amount of declarations', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
      assert.throws(function() { includedMixin.hasNumDeclarations(5); });
    });
  });

  describe('declares', function() {
    it('should not throw an error if mixin creates a declaration with the given property and value', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      includedMixin.declares(property, value);
    });

    it('should throw an error if mixin creates a declaration with the given property and not the value', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      assert.throws(function() { includedMixin.declares(property, 'blue'); });
    });

    it('should throw an error if the given property cannot be found in mixin output', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
      assert.throws(function() { includedMixin.declares(property, value); });
    });
  });

  describe('doesNotDeclare', function() {
    it('should throw an error if mixin creates a declaration with the given property and value', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      assert.throws(function() { includedMixin.doesNotDeclare(property, value); });
    });

    it('should not throw an error if mixin creates a declaration with the given property and not the value', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      includedMixin.doesNotDeclare(property, 'blue');
    });

    it('should not throw an error if the given property cannot be found in mixin output', function() {
      mockUtilities.expects('createAst').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
      includedMixin.doesNotDeclare(property, value);
    });
  });

  describe('equals', function() {
    it('should not throw an error if the output matches the input', function() {
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      includedMixin.equals(result);
    });

    it('throws an error if the output does not match the input', function() {
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      assert.throws(function() { includedMixin.equals('.blah{color:red}'); });
    });
  });

  describe('doesNotEqual', function() {
    it('should not throw an error if the output does not match the input', function() {
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      includedMixin.doesNotEqual('color:red;');
    });

    it('throws an error if the output does match the input', function() {
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      assert.throws(function() { includedMixin.doesNotEqual(result); });
    });
  });

  describe('calls', function() {
    it('should not throw an error if the given call is included in the mixins call', function() {
      mockUtilities.expects('createCss').twice().withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      includedMixin.calls(call);
    });

    it('throws an error if the given call is not included in the mixins call', function() {
      var otherCall = '@include other(blue)';
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns('.blah{color:red}');
      assert.throws(function() { includedMixin.calls(otherCall); });
    });
  });

  describe('doesNotCall', function() {
    it('should not throw an error if the given call is included in the mixins call', function() {
      var otherCall = '@include other(blue)';
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      mockUtilities.expects('createCss').withArgs(file, IncludedMixin.wrapIncludedMixin(otherCall)).returns('.blah{color:red}');
      includedMixin.doesNotCall(otherCall);
    });

    it('throws an error if the given call is not included in the mixins call', function() {
      mockUtilities.expects('createCss').twice().withArgs(file, IncludedMixin.wrapIncludedMixin(call)).returns(wrappedResult);
      assert.throws(function() { includedMixin.doesNotCall(call); });
    });
  });
});
