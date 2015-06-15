'use strict';

var path = require('path');
var Sassaby = require('../src/sassaby');

describe('sample-with-variables.scss', function() {
  var sassaby = new Sassaby(path.resolve(__dirname, 'fixtures/sample-with-variables.scss'), {
    variables: {
      'grid-columns': 12
    }
  });

  describe('make-offset', function() {
    var mixin;

    beforeEach(function() {
      mixin = sassaby.standaloneMixin('make-offset');
    });

    it('should return 1 declarations', function() {
      mixin.calledWithArgs('md', 6).hasNumDeclarations(1);
    });

    it('should create the correct class', function() {
      mixin.calledWithArgs('md', 6).createsSelector('.col-md-offset-6');
    });

    it('should have a webkit prefixed declaration', function() {
      mixin.calledWithArgs('md', 6).declares('margin-left', '50%');
    });
  });
});
