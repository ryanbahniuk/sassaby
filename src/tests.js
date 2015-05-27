'use strict';

var sassafras = require('./sassafras');
sassafras.setFile('src/sample.scss');

describe('sample', function() {
  describe('#appearance', function() {
    it('should return 3 declarations', function() {
      var call = ".test { @include appearance('button') }";
      sassafras.nDeclarations(call, 3);
    });
  });
});
