/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var sassafras = require('./src/sassafras');

describe('sample.scss', function() {
  sassafras.setFile('sample.scss');

  describe('#appearance', function() {
    var mixin = sassafras.includedMixin("appearance(button)");

    it('should return 3 declarations', function() {
      mixin.hasNDeclarations(3);
    });

    it('should have a webkit prefixed declaration', function() {
      mixin.includesDeclaration("-webkit-appearance", "button");
    });

    it('should have the correct entire output', function() {
      mixin.equals("-webkit-appearance: button; -moz-appearance: button; appearance: button;");
    });
  });

  describe('#make-column', function() {
    var mixin = sassafras.standaloneMixin("make-column(md, 6)");

    it('should define the correct class', function() {
      mixin.createsSelector(".col-md-6");
    });

    it('should return 2 declarations', function() {
      mixin.hasNDeclarations(2);
    });

    it('should have a webkit prefixed declaration', function() {
      mixin.includesDeclaration("max-width", "50%");
    });

    it('should have the correct entire output', function() {
      mixin.equals(".col-md-6 { flex-basis: 50%; max-width: 50%; }");
    });
  });

  describe('#remy', function() {
    it('convert to px units to rem units', function() {
      sassafras.fnction("remy(32px, 16px)").equals("2rem");
    });
  });

  describe('#boolean-switch', function() {
    it('should return true if passed true', function() {
      sassafras.fnction("boolean-switch(true)").isTrue();
    });

    it('should return false if passed false', function() {
      sassafras.fnction("boolean-switch(false)").isFalse();
    });
  });

  describe('#return-self', function() {
    it('testing truthy', function() {
      sassafras.fnction("return-self(true)").isTruthy();
      sassafras.fnction("return-self(1)").isTruthy();
      sassafras.fnction("return-self('a')").isTruthy();
      sassafras.fnction("return-self('')").isTruthy();
    });

    it('testing falsey', function() {
      sassafras.fnction("return-self(false)").isFalsey();
      sassafras.fnction("return-self(null)").isFalsey();
    });
  });

  describe('#make-general-alignments', function() {
    var mixin = sassafras.standaloneMixin("make-general-alignments(md)");

    it('should call the correct mixins', function() {
      mixin.calls("make-align-left(md)");
      mixin.calls("make-align-center(md)");
      mixin.calls("make-align-right(md)");
    });
  });

  describe('#animation', function() {
    var mixin = sassafras.includedMixin("animation(test, 500)");

    it('should have the correct output', function() {
      mixin.includesDeclaration("animation-name", "test");
      mixin.includesDeclaration("animation-duration", 500);
    });

    it('should call the correct mixins', function() {
      mixin.calls("prefixer(webkit, animation-name, test)");
      mixin.calls("prefixer(moz, animation-name, test)");
      mixin.calls("prefixer(webkit, animation-duration, 500)");
      mixin.calls("prefixer(moz, animation-duration, 500)");
    });
  });
});
