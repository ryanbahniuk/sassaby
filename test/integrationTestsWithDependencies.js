'use strict';

var sassaby = require('../src/sassaby');
var assert = sassaby.assert;

describe('sample-with-dependencies.scss', function() {
  sassaby.setFile(__dirname + '/fixtures/sample-with-dependencies.scss');
  sassaby.setDependencies([
    __dirname + '/fixtures/sample.scss'
  ]);

  describe('make-offset', function() {
    var mixin = assert.standaloneMixin("make-button(md)");

    it('should return 3 declarations', function() {
      mixin.hasNumDeclarations(3);
    });

    it('should create the correct class', function() {
      mixin.createsSelector(".btn-md");
    });

    it('should have a webkit prefixed declaration', function() {
      mixin.declares("-webkit-appearance", "button");
    });
  });
});
