'use strict';

var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');
var utilities = require('../src/utilities');
var parsers = require('../src/parsers');
var ast = require('./fixtures/ast.json');


describe('MixinResult', function() {
  var MixinResult;
  var cssmin;
  var mockUtilities;
  var mockParsers;
  var standaloneMixinResult;
  var includedMixinResult;

  var includedFile = '@mixin test($input) { color: $input }';
  var standaloneFile = '@mixin test($input) { .test { color: $input; } }';
  var call = '@include test(red)';
  var selector = '.test';
  var property = 'color';
  var value = 'red';
  var result = property + ':' + value;
  var wrappedResult = selector + '{' + result + '}';

  var args = [1, 2, 'hello', true];
  var argString = '1, 2, hello, true';

  beforeEach(function() {
    cssmin = sinon.spy(function(input) { return input; });
    MixinResult = proxyquire('../src/mixinResult', {
      './utilities': utilities,
      './parsers': parsers,
      'cssmin': cssmin
    });

    mockUtilities = sinon.mock(utilities);
    mockParsers = sinon.mock(parsers);

    mockUtilities.expects('createCss').withArgs(standaloneFile, MixinResult.wrapMixinWithArgs('standalone', call, args)).returns(wrappedResult);
    mockUtilities.expects('createAst').withArgs(standaloneFile, MixinResult.wrapMixinWithArgs('standalone', call, args)).returns(ast);
    standaloneMixinResult = new MixinResult('standalone', standaloneFile, call, args);
    mockUtilities.expects('createCss').withArgs(includedFile, MixinResult.wrapMixinWithArgs('included', call, args)).returns(wrappedResult);
    mockUtilities.expects('createAst').withArgs(includedFile, MixinResult.wrapMixinWithArgs('included', call, args)).returns(ast);
    includedMixinResult = new MixinResult('included', includedFile, call, args);
  });

  afterEach(function() {
    mockUtilities.restore();
    mockParsers.restore();
  });

  describe('wrapMixinWithArgs', function() {
    it('wraps the standalone mixin to not fail the compiler', function() {
      mockUtilities.expects('concatArgs').withArgs(args).returns(argString);
      assert.equal(MixinResult.wrapMixinWithArgs('standalone', call, args), '@include ' + call + '(' + argString +  ');');
    });

    it('wraps the included mixin to not fail the compiler', function() {
      mockUtilities.expects('concatArgs').withArgs(args).returns(argString);
      assert.equal(MixinResult.wrapMixinWithArgs('included', call, args), '.test{@include ' + call + '(' + argString +  ');}');
    });
  });

  describe('wrapMixin', function() {
    it('wraps the standalone mixin to not fail the compiler', function() {
      assert.equal(MixinResult.wrapMixin('standalone', call), '@include ' + call + ';');
    });

    it('wraps the included mixin to not fail the compiler', function() {
      assert.equal(MixinResult.wrapMixin('included', call), '.test{@include ' + call + ';}');
    });
  });

  describe('wrapOutput', function() {
    it('wraps the standalone output', function() {
      assert.equal(MixinResult.wrapOutput('standalone', wrappedResult), wrappedResult);
      assert(cssmin.calledWith(wrappedResult));
    });

    it('wraps the included output', function() {
      assert.equal(MixinResult.wrapOutput('included', result), wrappedResult);
      assert(cssmin.calledWith(wrappedResult));
    });
  });

  describe('unwrapOutput', function() {
    it('unwraps the standalone output', function() {
      assert.equal(MixinResult.unwrapOutput('standalone', wrappedResult), wrappedResult);
    });

    it('unwraps the included output', function() {
      assert.equal(MixinResult.unwrapOutput('included', wrappedResult), result);
    });
  });

  describe('new', function() {
    it('should set type, file, css, and ast for standalone mixin', function() {
      assert.equal(standaloneMixinResult.type, 'standalone');
      assert.equal(standaloneMixinResult.file, standaloneFile);
      assert.equal(standaloneMixinResult.css, wrappedResult);
      assert.equal(standaloneMixinResult.ast, ast);
    });

    it('should set type, file, css, and ast for included mixin', function() {
      assert.equal(includedMixinResult.type, 'included');
      assert.equal(includedMixinResult.file, includedFile);
      assert.equal(includedMixinResult.css, wrappedResult);
      assert.equal(includedMixinResult.ast, ast);
    });
  });

  describe('createsSelector', function() {
    it('should not throw an error if the selector is created by the standalone mixin', function() {
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(true);
      standaloneMixinResult.createsSelector(selector);
    });

    it('throws an error if the selector is not created by the standalone mixin', function() {
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(false);
      assert.throws(function() { standaloneMixinResult.createsSelector(selector); });
    });

    it('throws an error if the function is called on an included mixin', function() {
      assert.throws(function() { includedMixinResult.createsSelector(selector); });
    });
  });

  describe('doesNotCreateSelector', function() {
    it('should not throw an error if the selector is not created by the standalone mixin', function() {
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(false);
      standaloneMixinResult.doesNotCreateSelector(selector);
    });

    it('throws an error if the selector is created by the standalone mixin', function() {
      mockParsers.expects('hasSelector').withArgs(ast, selector).returns(true);
      assert.throws(function() { standaloneMixinResult.doesNotCreateSelector(selector); });
    });

    it('throws an error if the function is called on an included mixin', function() {
      assert.throws(function() { includedMixinResult.doesNotCreateSelector(selector); });
    });
  });

  describe('createsMediaQuery', function() {
    var mediaQuery = 'screen and (min-width: 600px)';
    var rule = {
      type: 'media',
      media: mediaQuery
    };

    it('should not throw an error if the media query is created by the standalone mixin', function() {
      mockParsers.expects('findMedia').withArgs(ast).returns(rule);
      standaloneMixinResult.createsMediaQuery(mediaQuery);
    });

    it('throws an error if the media query is not created by the standalone mixin', function() {
      mockParsers.expects('findMedia').withArgs(ast).returns(undefined);
      assert.throws(function() { standaloneMixinResult.createsMediaQuery(mediaQuery); });
    });

    it('throws an error if the function is called on an included mixin', function() {
      assert.throws(function() { includedMixinResult.createsMediaQuery(mediaQuery); });
    });
  });

  describe('doesNotCreateMediaQuery', function() {
    var mediaQuery = 'screen and (min-width: 600px)';
    var rule = {
      type: 'media',
      media: mediaQuery
    };

    it('should not throw an error if the media query is not created by the standalone mixin', function() {
      mockParsers.expects('findMedia').withArgs(ast).returns(undefined);
      standaloneMixinResult.doesNotCreateMediaQuery(mediaQuery);
    });

    it('throws an error if the media query is created by the standalone mixin', function() {
      mockParsers.expects('findMedia').withArgs(ast).returns(rule);
      assert.throws(function() { standaloneMixinResult.doesNotCreateMediaQuery(mediaQuery); });
    });

    it('throws an error if the function is called on an included mixin', function() {
      assert.throws(function() { includedMixinResult.doesNotCreateMediaQuery(mediaQuery); });
    });
  });

  describe('createsFontFace', function() {
    it('should not throw an error if the selector is created by the standalone mixin', function() {
      mockParsers.expects('hasFontFace').withArgs(ast).returns(true);
      standaloneMixinResult.createsFontFace();
    });

    it('throws an error if the selector is not created by the standalone mixin', function() {
      mockParsers.expects('hasFontFace').withArgs(ast).returns(false);
      assert.throws(function() { standaloneMixinResult.createsFontFace(); });
    });

    it('throws an error if the function is called on an included mixin', function() {
      assert.throws(function() { includedMixinResult.createsFontFace(); });
    });
  });

  describe('doesNotCreateFontFace', function() {
    it('should not throw an error if the selector is created by the standalone mixin', function() {
      mockParsers.expects('hasFontFace').withArgs(ast).returns(false);
      standaloneMixinResult.doesNotCreateFontFace();
    });

    it('throws an error if the selector is not created by the standalone mixin', function() {
      mockParsers.expects('hasFontFace').withArgs(ast).returns(true);
      assert.throws(function() { standaloneMixinResult.doesNotCreateFontFace(); });
    });

    it('throws an error if the function is called on an included mixin', function() {
      assert.throws(function() { includedMixinResult.doesNotCreateFontFace(); });
    });
  });

  describe('hasNumDeclarations', function() {
    context('for a standalone mixin', function() {
      it('should not throw an error if mixin creates the given amount of declarations', function() {
        mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
        standaloneMixinResult.hasNumDeclarations(4);
      });

      it('should throw an error if mixin does not create the given amount of declarations', function() {
        mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
        assert.throws(function() { standaloneMixinResult.hasNumDeclarations(5); });
      });
    });

    context('for an included mixin', function() {
      it('should not throw an error if mixin creates the given amount of declarations', function() {
        mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
        includedMixinResult.hasNumDeclarations(4);
      });

      it('should throw an error if mixin does not create the given amount of declarations', function() {
        mockParsers.expects('countDeclarations').withArgs(ast).returns(4);
        assert.throws(function() { includedMixinResult.hasNumDeclarations(5); });
      });
    });
  });

  describe('declares', function() {
    context('for a standalone mixin', function() {
      it('should not throw an error if mixin creates a declaration with the given property and value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        standaloneMixinResult.declares(property, value);
      });

      it('should throw an error if mixin creates a declaration with the given property and not the value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        assert.throws(function() { standaloneMixinResult.declares(property, 'blue'); });
      });

      it('should throw an error if the given property cannot be found in mixin output', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
        assert.throws(function() { standaloneMixinResult.declares(property, value); });
      });
    });

    context('for an included mixin', function() {
      it('should not throw an error if mixin creates a declaration with the given property and value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        includedMixinResult.declares(property, value);
      });

      it('should throw an error if mixin creates a declaration with the given property and not the value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        assert.throws(function() { includedMixinResult.declares(property, 'blue'); });
      });

      it('should throw an error if the given property cannot be found in mixin output', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
        assert.throws(function() { includedMixinResult.declares(property, value); });
      });
    });
  });

  describe('doesNotDeclare', function() {
    context('for a standalone mixin', function() {
      it('should throw an error if mixin creates a declaration with the given property and value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        assert.throws(function() { standaloneMixinResult.doesNotDeclare(property, value); });
      });

      it('should not throw an error if mixin creates a declaration with the given property and not the value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        standaloneMixinResult.doesNotDeclare(property, 'blue');
      });

      it('should not throw an error if the given property cannot be found in mixin output', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
        standaloneMixinResult.doesNotDeclare(property, value);
      });
    });

    context('for an included mixin', function() {
      it('should throw an error if mixin creates a declaration with the given property and value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        assert.throws(function() { includedMixinResult.doesNotDeclare(property, value); });
      });

      it('should not throw an error if mixin creates a declaration with the given property and not the value', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns({value: value});
        mockUtilities.expects('scrubQuotes').withArgs(value).returns(value);
        includedMixinResult.doesNotDeclare(property, 'blue');
      });

      it('should not throw an error if the given property cannot be found in mixin output', function() {
        mockParsers.expects('findDeclaration').withArgs(ast, property).returns(undefined);
        includedMixinResult.doesNotDeclare(property, value);
      });
    });
  });

  describe('equals', function() {
    context('for a standalone mixin', function() {
      it('should not throw an error if the output matches the input', function() {
        standaloneMixinResult.equals(wrappedResult);
      });

      it('throws an error if the output does not match the input', function() {
        assert.throws(function() { standaloneMixinResult.equals('.blah{color:red}'); });
      });
    });

    context('for an included mixin', function() {
      it('should not throw an error if the output matches the input', function() {
        includedMixinResult.equals(result);
      });

      it('throws an error if the output does not match the input', function() {
        assert.throws(function() { includedMixinResult.equals('.blah{color:red}'); });
      });
    });
  });

  describe('doesNotEqual', function() {
    context('for a standalone mixin', function() {
      it('should not throw an error if the output does not match the input', function() {
        standaloneMixinResult.doesNotEqual('color:red;');
      });

      it('throws an error if the output does match the input', function() {
        assert.throws(function() { standaloneMixinResult.doesNotEqual(wrappedResult); });
      });
    });

    context('for an included mixin', function() {
      it('should not throw an error if the output does not match the input', function() {
        includedMixinResult.doesNotEqual('color:red;');
      });

      it('throws an error if the output does match the input', function() {
        assert.throws(function() { includedMixinResult.doesNotEqual(result); });
      });
    });
  });

  describe('calls', function() {
    context('for a standalone mixin', function() {
      it('should not throw an error if the given call is included in the mixins call', function() {
        mockUtilities.expects('createCss').withArgs(standaloneFile, MixinResult.wrapMixin('standalone', call)).returns(wrappedResult);
        standaloneMixinResult.calls(call);
      });

      it('throws an error if the given call is not included in the mixins call', function() {
        var otherCall = 'other(blue)';
        mockUtilities.expects('createCss').withArgs(standaloneFile, MixinResult.wrapMixin('standalone', otherCall)).returns('.blah{color:red}');
        assert.throws(function() { standaloneMixinResult.calls(otherCall); });
      });
    });

    context('for an included mixin', function() {
      it('should not throw an error if the given call is included in the mixins call', function() {
        mockUtilities.expects('createCss').withArgs(includedFile, MixinResult.wrapMixin('included', call)).returns(wrappedResult);
        includedMixinResult.calls(call);
      });

      it('throws an error if the given call is not included in the mixins call', function() {
        var otherCall = 'other(blue)';
        mockUtilities.expects('createCss').withArgs(includedFile, MixinResult.wrapMixin('included', otherCall)).returns('.blah{color:red}');
        assert.throws(function() { includedMixinResult.calls(otherCall); });
      });
    });
  });

  describe('doesNotCall', function() {
    context('for a standalone mixin', function() {
      it('should not throw an error if the given call is not included in the mixins call', function() {
        var otherCall = 'other(blue)';
        mockUtilities.expects('createCss').withArgs(standaloneFile, MixinResult.wrapMixin('standalone', otherCall)).returns('.blah{color:red}');
        standaloneMixinResult.doesNotCall(otherCall);
      });

      it('throws an error if the given call is included in the mixins call', function() {
        mockUtilities.expects('createCss').withArgs(standaloneFile, MixinResult.wrapMixin('standalone', call)).returns(wrappedResult);
        assert.throws(function() { standaloneMixinResult.doesNotCall(call); });
      });
    });

    context('for an included mixin', function() {
      it('should not throw an error if the given call is not included in the mixins call', function() {
        var otherCall = 'other(blue)';
        mockUtilities.expects('createCss').withArgs(includedFile, MixinResult.wrapMixin('included', otherCall)).returns('.blah{color:red}');
        includedMixinResult.doesNotCall(otherCall);
      });

      it('throws an error if the given call is included in the mixins call', function() {
        mockUtilities.expects('createCss').withArgs(includedFile, MixinResult.wrapMixin('included', call)).returns(wrappedResult);
        assert.throws(function() { includedMixinResult.doesNotCall(call); });
      });
    });
  });
});
