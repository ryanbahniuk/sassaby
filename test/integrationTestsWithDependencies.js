'use strict';

var path = require('path');
var sassaby = require('../src/sassaby');
var assert = sassaby.assert;

sassaby.setFile(path.resolve(__dirname, 'fixtures/sample-with-dependencies.scss'));
sassaby.setDependencies([
  path.resolve(__dirname, 'fixtures/sample.scss')
]);

describe('sample-with-dependencies.scss', function() {
  describe('make-offset', function() {
    var mixin = assert.standaloneMixin('make-button');

    it('should return 3 declarations', function() {
      mixin.calledWith('md').hasNumDeclarations(3);
    });

    it('should create the correct class', function() {
      mixin.calledWith('md').createsSelector('.btn-md');
    });

    it('should have a webkit prefixed declaration', function() {
      mixin.calledWith('md').declares('-webkit-appearance', 'button');
    });
  });
});
