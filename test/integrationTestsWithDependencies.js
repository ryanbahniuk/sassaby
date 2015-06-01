'use strict';

var sassafras = require('../src/sassafras');
var assert = sassafras.assert;

describe('sample-with-dependencies.scss', function() {
  sassafras.setFile(__dirname + '/fixtures/sample-with-dependencies.scss');
  sassafras.setDependencies([
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
