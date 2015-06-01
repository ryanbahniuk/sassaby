'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');

var renderSync;
var cssmin;
var parse;
var utilities;

var file = '@mixin test($input) { color: $input }';
var string = 'test(red)';
var combined = file + string;

describe('Utilities', function() {
  beforeEach(function() {
    renderSync = sinon.spy(function(options) { return { css: options.data }; });
    cssmin = sinon.spy(function(input) { return input; });
    parse = sinon.spy(function(input) { return input; });
    utilities = proxyquire('../src/utilities', {
      'node-sass': { 'renderSync': renderSync },
      'cssmin': cssmin,
      'css': { 'parse': parse }
    });
  });

  describe('compileFromString', function() {
    it('should call sass.renderSync with the given string string and return the compilation', function() {
      assert.equal(utilities.compileFromString(combined), combined);
      renderSync.calledWith({data: combined});
    });
  });

  describe('compileWithFile', function() {
    it('should call compileFromString with the combined css of the inputs', function() {
      sinon.mock(utilities).expects('compileFromString').withArgs(combined).returns(combined);
      assert.equal(utilities.compileWithFile(file, string), combined);
    });
  });

  describe('createCss', function() {
    it('should minify the result of compileWithFile', function() {
      sinon.mock(utilities).expects('compileWithFile').withArgs(file, string).returns(combined);
      assert.equal(utilities.createCss(file, string), combined);
      cssmin.calledWith(combined);
    });
  });

  describe('createAst', function() {
    it('should parse the result of createCss', function() {
      sinon.mock(utilities).expects('createCss').withArgs(file, string).returns(combined);
      assert.equal(utilities.createAst(file, string), combined);
      parse.calledWith(combined);
    });
  });

  describe('scrubQuotes', function() {
    it('should remove double quotes from the inputted string', function() {
      assert.equal(utilities.scrubQuotes('"hello"'), 'hello');
    });

    it('should remove single quotes from the inputted string', function() {
      assert.equal(utilities.scrubQuotes("'hello'"), 'hello');
    });

    it('should remove both quotes from the inputted string', function() {
      assert.equal(utilities.scrubQuotes("'\"hello\"'"), 'hello');
    });
  });
});
