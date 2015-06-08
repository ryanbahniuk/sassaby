'use strict';

var path = require('path');
var sassaby = require('../src/sassaby');
var assert = sassaby.assert;

sassaby.setFile(path.resolve(__dirname, 'fixtures/sample-with-variables.scss'));
sassaby.setVariables({
  'grid-columns': 12
});

describe('sample-with-variables.scss', function() {
  describe('make-offset', function() {
    var mixin = assert.standaloneMixin('make-offset');

    it('should return 1 declarations', function() {
      mixin.calledWith('md', 6).hasNumDeclarations(1);
    });

    it('should create the correct class', function() {
      mixin.calledWith('md', 6).createsSelector('.col-md-offset-6');
    });

    it('should have a webkit prefixed declaration', function() {
      mixin.calledWith('md', 6).declares('margin-left', '50%');
    });
  });
});
