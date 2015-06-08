'use strict';

var path = require('path');
var Sassaby = require('../src/sassaby');

describe('sample-with-dependencies.scss', function() {
  var sassaby = new Sassaby(path.resolve(__dirname, 'fixtures/sample-with-dependencies.scss'), {
    dependencies: [
      path.resolve(__dirname, 'fixtures/sample.scss')
    ]
  });

  describe('make-offset', function() {
    var mixin;

    beforeEach(function() {
      mixin = sassaby.standaloneMixin('make-button');
    });

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
