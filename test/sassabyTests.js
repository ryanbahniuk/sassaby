'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var Mixin = require('../src/types/mixin');
var Func = require('../src/types/func');

describe('Sassaby', function() {
  var Sassaby;
  var readFileSync;
  var filename = 'file.scss';
  var dependency = 'depends-on-this.scss';
  var fileContents = 'File Contents!!!!!!';

  beforeEach(function() {
    readFileSync = sinon.spy(function(filename) { return fileContents; });
    Sassaby = proxyquire('../src/sassaby', {
      'fs': { 'readFileSync': readFileSync }
    });
  });

  describe('setVariables', function() {
    it('should return a string of the SASS variable declaration if given one variable', function() {
      var variables = {
        'color': 'blue'
      };
      assert.equal(Sassaby.setVariables(variables), '$color:blue;');
    });

    it('should return a string of SASS variable declarations if given more than one variable', function() {
      var variables = {
        'color': 'blue',
        'font-size': '16px'
      };
      assert.equal(Sassaby.setVariables(variables), '$color:blue;$font-size:16px;');
    });
  });

  describe('setDependencies', function() {
    it('should return a string of the SASS import if given one dependency', function() {
      var dependencies = [
        'firstImport'
      ];
      assert.equal(Sassaby.setDependencies(dependencies), "@import 'firstImport';");
    });

    it('should return a string of SASS imports if given more than one dependency', function() {
      var dependencies = [
        'firstImport',
        'secondImport'
      ];
      assert.equal(Sassaby.setDependencies(dependencies), "@import 'firstImport';@import 'secondImport';");
    });
  });

  describe('new', function() {
    it('should set the correct properties when only passed a path', function() {
      var sassaby = new Sassaby(filename);
      assert(readFileSync.calledWith(filename));
      assert.equal(sassaby.path, filename);
      assert.equal(sassaby.file, fileContents);
      assert.equal(sassaby.variables, '');
      assert.equal(sassaby.dependencies, '');
    });

    it('should set the correct properties when passed a path and variables', function() {
      var sassaby = new Sassaby(filename, {
        variables: {
          'test': 1
        }
      });
      assert(readFileSync.calledWith(filename));
      assert.equal(sassaby.path, filename);
      assert.equal(sassaby.file, fileContents);
      assert.equal(sassaby.variables, '$test:1;');
      assert.equal(sassaby.dependencies, '');
    });

    it('should set the correct properties when passed a path and dependencies', function() {
      var sassaby = new Sassaby(filename, {
        dependencies: [
          dependency
        ]
      });
      assert(readFileSync.calledWith(filename));
      assert.equal(sassaby.path, filename);
      assert.equal(sassaby.file, fileContents);
      assert.equal(sassaby.variables, '');
      assert.equal(sassaby.dependencies, "@import '" + dependency + "';");
    });

    it('should set the correct properties when passed a path, variables, and dependencies', function() {
      var sassaby = new Sassaby(filename, {
        variables: {
          'test': 1
        },
        dependencies: [
          dependency
        ]
      });
      assert(readFileSync.calledWith(filename));
      assert.equal(sassaby.path, filename);
      assert.equal(sassaby.file, fileContents);
      assert.equal(sassaby.variables, '$test:1;');
      assert.equal(sassaby.dependencies, "@import '" + dependency + "';");
    });
  });

  describe('includedMixin', function() {
    it('return a new instance of Mixin', function() {
      var sassaby = new Sassaby(filename);
      var call = '@include test(blue);';
      assert(sassaby.includedMixin(call) instanceof Mixin);
    });
  });

  describe('standaloneMixin', function() {
    it('return a new instance of Mixin', function() {
      var sassaby = new Sassaby(filename);
      var call = '@include test(blue);';
      assert(sassaby.standaloneMixin(call) instanceof Mixin);
    });
  });

  describe('func', function() {
    it('return a new instance of Func', function() {
      var sassaby = new Sassaby(filename);
      var call = 'test(blue);';
      assert(sassaby.func(call) instanceof Func);
    });
  });
});
