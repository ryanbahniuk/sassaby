'use strict';

var sassafras = require('./sassafras');
sassafras.setFile('src/sample.scss');

describe('sample', function() {
  describe('#appearance', function() {
    it('should return 3 declarations', function() {
      var call = ".test { @include appearance('button') }";
      sassafras.assertDeclarationsNumber(call, 3);
    });

    it('should have a webkit prefixed declaration', function() {
      var call = ".test { @include appearance('button') }";
      sassafras.assertDeclaration(call, "-webkit-appearance", "button");
    });

    it('should define the correct class', function() {
      var call = "@include make-column(md, 6);";
      sassafras.assertSelectorCreation(call, ".col-md-6");
    });
  });
});
