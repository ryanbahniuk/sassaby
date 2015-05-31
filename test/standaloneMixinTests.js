/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var utilities = require('../src/utilities');
var parsers = require('../src/parsers');
var ast = require('./fixtures/ast.json');

var StandaloneMixin;
var standaloneMixin;
var mockUtilities;
var mockParsers;

var selector = '.text';
var file = '@mixin test($input) { .test { color: $input } }';
var call = '@include test(red)';
var property = 'color';
var value = 'red';
var result = selector + '{' + property + ":" + value + '}';

describe('StandaloneMixin', function() {
  beforeEach(function() {
    StandaloneMixin = proxyquire('../src/types/standaloneMixin', {
      '../utilities': utilities,
      '../parsers': parsers,
    });
    standaloneMixin = new StandaloneMixin(file, call);
    mockUtilities = sinon.mock(utilities);
    mockParsers = sinon.mock(parsers);
  });

  afterEach(function() {
    mockUtilities.restore();
    mockParsers.restore();
  });

  describe('wrapStandaloneMixin', function() {
    it('wrap the function with the necessary SCSS to not fail the compiler', function() {
      assert.equal(StandaloneMixin.wrapStandaloneMixin(call), "@include " + call + ";");
    });
  });

  describe('new', function() {
    it('should set file and call from the arguments', function() {
      assert.equal(standaloneMixin.file, file);
      assert.equal(standaloneMixin.call, call);
    });
  });

  describe('createsSelector', function() {
    it('should not throw an error if the selector is created by the mixin', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(true);
      standaloneMixin.createsSelector(selector);
    });

    it('throws an error if the selector is not created by the mixin', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(false);
      assert.throws(function() { standaloneMixin.createsSelector(selector); });
    });
  });

  describe('doesNotCreateSelector', function() {
    it('should not throw an error if the selector is not created by the mixin', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(false);
      standaloneMixin.doesNotCreateSelector(selector);
    });

    it('throws an error if the selector is created by the mixin', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(true);
      assert.throws(function() { standaloneMixin.doesNotCreateSelector(selector); });
    });
  });

  describe('hasNumDeclarations', function() {
    it('should not throw an error if mixin creates the given amount of declarations', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
      standaloneMixin.hasNumDeclarations(4);
    });

    it('should throw an error if mixin does not create the given amount of declarations', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
      assert.throws(function() { standaloneMixin.hasNumDeclarations(5); });
    });
  });

  describe('declares', function() {
    it('should not throw an error if mixin creates a declaration with the given property and value', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      standaloneMixin.declares(property, value);
    });

    it('should throw an error if mixin creates a declaration with the given property and not the value', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      assert.throws(function() { standaloneMixin.declares(property, 'blue'); });
    });

    it('should throw an error if the given property cannot be found in mixin output', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
      assert.throws(function() { standaloneMixin.declares(property, value); });
    });
  });

  describe('doesNotDeclare', function() {
    it('should throw an error if mixin creates a declaration with the given property and value', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      assert.throws(function() { standaloneMixin.doesNotDeclare(property, value); });
    });

    it('should not throw an error if mixin creates a declaration with the given property and not the value', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
      mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
      standaloneMixin.doesNotDeclare(property, 'blue');
    });

    it('should not throw an error if the given property cannot be found in mixin output', function() {
      mockUtilities.expects('createAst').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(ast);
      mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
      standaloneMixin.doesNotDeclare(property, value);
    });
  });

  describe('equals', function() {
    it('should not throw an error if the output matches the input', function() {
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      standaloneMixin.equals(result);
    });

    it('throws an error if the output does not match the input', function() {
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      assert.throws(function() { standaloneMixin.equals('.blah{color:red}'); });
    });
  });

  describe('doesNotEqual', function() {
    it('should not throw an error if the output does not match the input', function() {
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      standaloneMixin.doesNotEqual('.blah{color:red}');
    });

    it('throws an error if the output does match the input', function() {
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      assert.throws(function() { standaloneMixin.doesNotEqual(result); });
    });
  });

  describe('calls', function() {
    it('should not throw an error if the given call is included in the mixins call', function() {
      mockUtilities.expects('createCss').twice().withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      standaloneMixin.calls(call);
    });

    it('throws an error if the given call is not included in the mixins call', function() {
      var otherCall = '@include other(blue)';
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(otherCall)).returns('.blah{color:red}');
      assert.throws(function() { standaloneMixin.calls(otherCall); });
    });
  });

  describe('doesNotCall', function() {
    it('should not throw an error if the given call is included in the mixins call', function() {
      var otherCall = '@include other(blue)';
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      mockUtilities.expects('createCss').withArgs(file, StandaloneMixin.wrapStandaloneMixin(otherCall)).returns('.blah{color:red}');
      standaloneMixin.doesNotCall(otherCall);
    });

    it('throws an error if the given call is not included in the mixins call', function() {
      mockUtilities.expects('createCss').twice().withArgs(file, StandaloneMixin.wrapStandaloneMixin(call)).returns(result);
      assert.throws(function() { standaloneMixin.doesNotCall(call); });
    });
  });
});
