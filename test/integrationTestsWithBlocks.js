'use strict';

var path = require('path');
var Sassaby = require('../src/sassaby');

describe('sample-with-blocks.scss', function() {
  var sassaby = new Sassaby(path.resolve(__dirname, 'fixtures/sample-with-blocks.scss'));

  describe('sm-specific-styles', function() {
    var block = '.test {color: red;}';
    var mixin;

    beforeEach(function() {
      mixin = sassaby.standaloneMixin('sm-specific-styles');
    });

    it('should create the correct media query', function() {
      var mediaQuery = 'only screen and (min-width: 0px) and (max-width: 400px)';
      mixin.calledWithBlock(block).createsMediaQuery(mediaQuery);
    });

    it('should create the correct class', function() {
      mixin.calledWithBlock(block).createsSelector('.test');
    });

    it('should have the correct color declaration', function() {
      mixin.calledWithBlock(block).declares('color', 'red');
    });
  });

  describe('sm-specific-styles', function() {
    var block = 'color: red;';
    var mixin;

    beforeEach(function() {
      mixin = sassaby.includedMixin('sm-specific-styles');
    });

    it('should create the correct media query', function() {
      var mediaQuery = 'only screen and (min-width: 0px) and (max-width: 400px)';
      mixin.calledWithBlock(block).createsMediaQuery(mediaQuery);
    });

    it('should have the correct color declaration', function() {
      mixin.calledWithBlock(block).declares('color', 'red');
    });
  });

  describe('make-small-color', function() {
    var block = 'width: 100%;';
    var color = 'red';
    var mixin;

    beforeEach(function() {
      mixin = sassaby.includedMixin('make-small-color');
    });

    it('should create the correct media query', function() {
      var mediaQuery = 'only screen and (min-width: 0px) and (max-width: 400px)';
      mixin.calledWithBlockAndArgs(block, color).createsMediaQuery(mediaQuery);
    });

    it('should have the correct color declaration', function() {
      mixin.calledWithBlockAndArgs(block, color).declares('color', 'red');
    });

    it('should have the correct width declaration', function() {
      mixin.calledWithBlockAndArgs(block, color).declares('width', '100%');
    });
  });
});
