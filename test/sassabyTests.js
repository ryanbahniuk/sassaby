'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var Mixin = require('../src/types/mixin');
var Func = require('../src/types/func');

var sassaby;
var readFileSync;

var filename = 'file.scss';
var fileContents = 'File Contents!!!!!!';

describe('Sassaby', function() {
  beforeEach(function() {
    readFileSync = sinon.spy(function(filename) { return fileContents; });
    sassaby = proxyquire('../src/sassaby', {
      'fs': { 'readFileSync': readFileSync }
    });
  });

  describe('#setFile', function() {
    it('should set this.filename and this.file', function() {
      assert.equal(sassaby.path, null);
      assert.equal(sassaby.file, null);
      sassaby.setFile(filename);
      readFileSync.calledWith(filename);
      assert.equal(sassaby.path, filename);
      assert.equal(sassaby.file, fileContents);
    });
  });

  describe('#setVariables', function() {
    it('should set this.variables to a string of the SASS variable declaration', function() {
      var variables = {
        'color': 'blue'
      };
      assert.equal(sassaby.variables, '');
      sassaby.setVariables(variables);
      assert.equal(sassaby.variables, '$color:blue;');
    });

    it('should set this.variables to a string of SASS variable declarations if more than one is passed', function() {
      var variables = {
        'color': 'blue',
        'font-size': '16px'
      };
      assert.equal(sassaby.variables, '');
      sassaby.setVariables(variables);
      assert.equal(sassaby.variables, '$color:blue;$font-size:16px;');
    });
  });

  describe('#setDependencies', function() {
    it('should set this.dependencies to a string of the SASS import', function() {
      var dependencies = [
        'firstImport'
      ];
      assert.equal(sassaby.dependencies, '');
      sassaby.setDependencies(dependencies);
      assert.equal(sassaby.dependencies, "@import 'firstImport';");
    });

    it('should set this.dependencies to a string of SASS imports if more than one is passed', function() {
      var dependencies = [
        'firstImport',
        'secondImport'
      ];
      assert.equal(sassaby.dependencies, '');
      sassaby.setDependencies(dependencies);
      assert.equal(sassaby.dependencies, "@import 'firstImport';@import 'secondImport';");
    });
  });

  describe('assert', function() {
    describe('includedMixin', function() {
      it('return a new instance of Mixin', function() {
        var call = "@include test(blue);";
        assert(sassaby.assert.includedMixin(call) instanceof Mixin);
      });
    });

    describe('standaloneMixin', function() {
      it('return a new instance of Mixin', function() {
        var call = "@include test(blue);";
        assert(sassaby.assert.standaloneMixin(call) instanceof Mixin);
      });
    });

    describe('func', function() {
      it('return a new instance of Func', function() {
        var call = "test(blue);";
        assert(sassaby.assert.func(call) instanceof Func);
      });
    });
  });
});
