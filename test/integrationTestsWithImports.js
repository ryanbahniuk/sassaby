'use strict';

var path = require('path');
var Sassaby = require('../src/sassaby');

describe('sample-with-imports.scss', function() {
  var sassaby = new Sassaby(path.resolve(__dirname, 'fixtures/sample-with-imports.scss'));

  describe('imports', function() {
    it('should import variables', function() {
      sassaby.imports('variables');
    });

    it('should import sample-with-variables', function() {
      sassaby.imports('sample-with-variables');
    });

    it('should import sample', function() {
      sassaby.imports('sample');
    });

    it('should import sample-with-dependencies', function() {
      sassaby.imports('sample-with-dependencies');
    });

    it('should not import nope', function() {
      sassaby.doesNotImport('nope');
    });
  });
});
