'use strict';

var assert = require('assert');
var cssmin = require('cssmin');
var utilities = require('./utilities');
var parsers = require('./parsers');

function wrapMixinWithArgs(type, call, args) {
  var argString = utilities.concatArgs(args);
  var includeString = '@include ' + call + '(' + argString +  ');';
  return type === 'included' ? '.test{' + includeString + '}' : includeString;
}

function wrapMixin(type, call) {
  var includeString = '@include ' + call + ';';
  return type === 'included' ? '.test{' + includeString + '}' : includeString;
}

function wrapOutput(type, css) {
  if (type === 'included') {
    return cssmin('.test{' + css + '}');
  } else {
    return cssmin(css);
  }
}

function unwrapOutput(type, css) {
  if (type === 'included') {
    return css.replace('.test{', '').replace('}', '');
  } else {
    return css;
  }
}

function MixinResult(type, file, call, args) {
  this.type = type;
  this.file = file;
  this.css = utilities.createCss(file, wrapMixinWithArgs(type, call, args));
  this.ast = utilities.createAst(file, wrapMixinWithArgs(type, call, args));
}

MixinResult.prototype = {
  createsSelector: function(selector) {
    if (this.type === 'included') {
      throw 'createsSelector is not available for included mixins.';
    }
    var message = 'Could not find selector ' + selector + ' in mixin output.';
    assert(parsers.hasSelector(this.ast, selector), message);
  },

  doesNotCreateSelector: function(selector) {
    if (this.type === 'included') {
      throw 'doesNotCreateSelector is not available for included mixins.';
    }
    var message = 'Mixin created selector ' + selector + '.';
    assert(!parsers.hasSelector(this.ast, selector), message);
  },

  hasNumDeclarations: function(num) {
    var numDeclarations = parsers.countDeclarations(this.ast);
    var message = 'Mixin has ' + numDeclarations + ' declarations, but you gave ' + num + '.';
    assert.equal(numDeclarations, num, message);
  },

  declares: function(property, value) {
    var declaration = parsers.findDeclaration(this.ast, property);
    var declarationValue = declaration ? utilities.scrubQuotes(declaration.value) : '';
    var message = 'Value: ' + declarationValue + ' does not equal value: ' + value + '.';
    assert.equal(declarationValue, value.toString(), message);
  },

  doesNotDeclare: function(property, value) {
    var declaration = parsers.findDeclaration(this.ast, property);
    var declarationValue = declaration ? utilities.scrubQuotes(declaration.value) : '';
    var message = 'Value: ' + declarationValue + ' equals value: ' + value + '.';
    assert.notEqual(declarationValue, value.toString(), message);
  },

  equals: function(output) {
    var wrappedOutput = wrapOutput(this.type, output);
    var message = 'Mixin output is ' + this.css + ' and you gave ' + wrappedOutput + '.';
    assert.equal(this.css, wrappedOutput, message);
  },

  doesNotEqual: function(output) {
    var wrappedOutput = wrapOutput(this.type, output);
    var message = 'Mixin output equals ' + output + '.';
    assert.notEqual(this.css, wrappedOutput, message);
  },

  calls: function(mixin) {
    var mixinCss = utilities.createCss(this.file, wrapMixin(this.type, mixin));
    var message = 'Could not find the output from ' + mixin + ' in mixin.';
    assert(this.css.indexOf(unwrapOutput(this.type, mixinCss)) > -1, message);
  },

  doesNotCall: function(mixin) {
    var mixinCss = utilities.createCss(this.file, wrapMixin(this.type, mixin));
    var message = 'Mixin called ' + mixin + '.';
    assert(this.css.indexOf(unwrapOutput(this.type, mixinCss)) === -1, message);
  }
};

if (process.env.NODE_ENV === 'test') {
  MixinResult.wrapMixinWithArgs = wrapMixinWithArgs;
  MixinResult.wrapMixin = wrapMixin;
  MixinResult.wrapOutput = wrapOutput;
  MixinResult.unwrapOutput = unwrapOutput;
}

module.exports = MixinResult;
