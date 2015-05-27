'use strict';

var sassafras = require('./sassafras');
sassafras.setFile('src/sample.scss');

describe('sample', function() {
  describe('#appearance', function() {
    it('should return 3 declarations', function() {
      sassafras.setCall(".test { @include appearance('button') }");
      sassafras.assertDeclarationsNumber(3);
    });

    it('should have a webkit prefixed declaration', function() {
      sassafras.setCall(".test { @include appearance('button') }");
      sassafras.assertDeclaration("-webkit-appearance", "button");
    });

    it('should define the correct class', function() {
      sassafras.setCall("@include make-column(md, 6);");
      sassafras.assertSelectorCreation(".col-md-6");
    });
  });
});
