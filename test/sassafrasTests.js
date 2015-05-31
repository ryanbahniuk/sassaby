/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var IncludedMixin = require('../src/types/includedMixin');
var StandaloneMixin = require('../src/types/standaloneMixin');
var Func = require('../src/types/func');

var readFileSync = sinon.spy(function(filename) { return fileContents; });
var sassafras = proxyquire('../src/sassafras', {
  'fs': { 'readFileSync': readFileSync }
});

var filename = 'file.scss';
var fileContents = 'File Contents!!!!!!';

describe('Sassafras', function() {
  describe('#setFile', function() {
    it('should set this.filename and this.file', function() {
      assert.equal(sassafras.path, null);
      assert.equal(sassafras.file, null);
      sassafras.setFile(filename);
      readFileSync.calledWith(filename);
      assert.equal(sassafras.path, filename);
      assert.equal(sassafras.file, fileContents);
    });
  });

  describe('assert', function() {
    describe('includedMixin', function() {
      it('return a new instance of IncludedMixin', function() {
        var call = "@include test(blue);";
        assert(sassafras.assert.includedMixin(call) instanceof IncludedMixin);
      });
    });

    describe('standaloneMixin', function() {
      it('return a new instance of StandaloneMixin', function() {
        var call = "@include test(blue);";
        assert(sassafras.assert.standaloneMixin(call) instanceof StandaloneMixin);
      });
    });

    describe('func', function() {
      it('return a new instance of Func', function() {
        var call = "test(blue);";
        assert(sassafras.assert.func(call) instanceof Func);
      });
    });
  });
});
