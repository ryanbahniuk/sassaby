'use strict';

var sassafras = require('./sassafras');

describe('sample.scss', function() {
  sassafras.setFile('src/sample.scss');
  
  describe('#appearance', function() {
    it('should return 3 declarations', function() {
      sassafras.setCall("appearance(button)");
      sassafras.includedMixin.assertDeclarationsNumber(3);
    });

    it('should have a webkit prefixed declaration', function() {
      sassafras.setCall("appearance(button)");
      sassafras.includedMixin.includesDeclaration("-webkit-appearance", "button");
    });

    it('should have the correct entire output', function() {
      sassafras.setCall("appearance(button)");
      var result = "-webkit-appearance: button; -moz-appearance: button; appearance: button;";
      sassafras.includedMixin.assertEntireOutput(result);
    });
  });

  describe('#make-column', function() {
    it('should define the correct class', function() {
      sassafras.setCall("make-column(md, 6)");
      sassafras.standaloneMixin.assertSelectorCreation(".col-md-6");
    });
  });

  describe('#remy', function() {
    it('convert to px units to rem units', function() {
      sassafras.setCall("remy(32px, 16px)");
      sassafras.fnction.assertEqual("2rem");
    });
  });
});
