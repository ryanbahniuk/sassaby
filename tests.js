/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var sassafras = require('./src/sassafras');
var assert = sassafras.assert;

describe('sample.scss', function() {
  sassafras.setFile('sample.scss');

  describe('#appearance', function() {
    var mixin = assert.includedMixin("appearance(button)");

    it('should return 3 declarations', function() {
      mixin.hasNumDeclarations(3);
    });

    it('should have a webkit prefixed declaration', function() {
      mixin.declares("-webkit-appearance", "button");
    });

    it('should not make an incorrect declaration', function() {
      mixin.doesNotDeclare("-webkit-appearance", "none");
    });

    it('should have the correct entire output', function() {
      mixin.equals("-webkit-appearance: button; -moz-appearance: button; appearance: button;");
    });

    it('should not equal the incorrect output', function() {
      mixin.doesNotEqual("-moz-appearance: button; appearance: button;");
    });
  });

  describe('#make-column', function() {
    var mixin = assert.standaloneMixin("make-column(md, 6)");

    it('should define the correct class', function() {
      mixin.createsSelector(".col-md-6");
    });

    it('should not define the incorrect class', function() {
      mixin.doesNotCreateSelector(".col-lg-6");
    });

    it('should return 2 declarations', function() {
      mixin.hasNumDeclarations(2);
    });

    it('should declare the correct width', function() {
      mixin.declares("max-width", "50%");
    });

    it('should not declare the incorrect width', function() {
      mixin.doesNotDeclare("max-width", "60%");
    });

    it('should have the correct entire output', function() {
      mixin.equals(".col-md-6 { flex-basis: 50%; max-width: 50%; }");
    });

    it('should not have incorrect output', function() {
      mixin.doesNotEqual(".col-md-8 { flex-basis: 50%; max-width: 50%; }");
    });
  });

  describe('#remy', function() {
    it('convert to px units to rem units', function() {
      assert.func("remy(32px, 16px)").equals("2rem");
    });

    it('has the correct output unit', function() {
      assert.func("remy(32px, 16px)").doesNotEqual("2em");
    });
  });

  describe('#boolean-switch', function() {
    it('should return true if passed true', function() {
      assert.func("boolean-switch(true)").isTrue();
    });

    it('should return false if passed false', function() {
      assert.func("boolean-switch(false)").isFalse();
    });
  });

  describe('#return-self', function() {
    it('testing truthy', function() {
      assert.func("return-self(true)").isTruthy();
      assert.func("return-self(1)").isTruthy();
      assert.func("return-self('a')").isTruthy();
      assert.func("return-self('')").isTruthy();
    });

    it('testing falsey', function() {
      assert.func("return-self(false)").isFalsey();
      assert.func("return-self(null)").isFalsey();
    });
  });

  describe('#make-general-alignments', function() {
    var mixin = assert.standaloneMixin("make-general-alignments(md)");

    it('should call the correct mixins', function() {
      mixin.calls("make-align-left(md)");
      mixin.calls("make-align-center(md)");
      mixin.calls("make-align-right(md)");
    });

    it('should not call the incorrect mixin', function() {
      mixin.doesNotCall("make-align-left(lg)");
    });
  });

  describe('#animation', function() {
    var mixin = assert.includedMixin("animation(test, 500)");

    it('should have the correct output', function() {
      mixin.declares("animation-name", "test");
      mixin.declares("animation-duration", 500);
    });

    it('should call the correct mixins', function() {
      mixin.calls("prefixer(webkit, animation-name, test)");
      mixin.calls("prefixer(moz, animation-name, test)");
      mixin.calls("prefixer(webkit, animation-duration, 500)");
      mixin.calls("prefixer(moz, animation-duration, 500)");
    });

    it('should not call the incorrect mixins', function() {
      mixin.doesNotCall("prefixer(o, animation-name, test)");
    });
  });
});
