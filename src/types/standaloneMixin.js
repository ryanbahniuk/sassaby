/* jshint globalstrict: true, node:true, mocha: true */

'use strict';

var assert = require('assert');
var cssmin = require('cssmin');
var utilities = require('../utilities');
var parsers = require('../parsers');

function wrapStandaloneMixin(call) {
  return "@include " + call + ";";
}

function StandaloneMixin(file, call) {
  this.file = file;
  this.call = wrapStandaloneMixin(call);
}

StandaloneMixin.prototype = {
  createsSelector: function(selector) {
    var ast = utilities.createAst(this.file, this.call);
    var message = "Could not find selector " + selector + " in mixin output.";
    assert(parsers.hasSelector(ast, selector), message);
  },

  doesNotCreateSelector: function(selector) {
    var ast = utilities.createAst(this.file, this.call);
    var message = "Mixin created selector " + selector + ".";
    assert(!parsers.hasSelector(ast, selector), message);
  },

  hasNumDeclarations: function(num) {
    var ast = utilities.createAst(this.file, this.call);
    var numDeclarations = parsers.countDeclarations(ast);
    var message = "Mixin has " + numDeclarations + " declarations, but you gave " + num + ".";
    assert.equal(numDeclarations, num, message);
  },

  declares: function(property, value) {
    var ast = utilities.createAst(this.file, this.call);
    var declaration = parsers.findDeclaration(ast, property);
    var declarationValue = utilities.scrubQuotes(declaration.value);
    var message = "Value: " + declarationValue + " does not equal value: " + value + ".";
    assert.equal(declarationValue, value.toString(), message);
  },

  doesNotDeclare: function(property, value) {
    var ast = utilities.createAst(this.file, this.call);
    var declaration = parsers.findDeclaration(ast, property);
    var declarationValue = utilities.scrubQuotes(declaration.value);
    var message = "Value: " + declarationValue + " equals value: " + value + ".";
    assert.notEqual(declarationValue, value.toString(), message);
  },

  equals: function(output) {
    var css = utilities.createCss(this.file, this.call);
    var wrappedOutput = cssmin(output);
    var message = "Mixin output is " + css + " and you gave " + wrappedOutput + ".";
    assert.equal(css, wrappedOutput, message);
  },

  doesNotEqual: function(output) {
    var css = utilities.createCss(this.file, this.call);
    var wrappedOutput = cssmin(output);
    var message = "Mixin output equals " + output + ".";
    assert.notEqual(css, wrappedOutput, message);
  },

  calls: function(mixin) {
    var css = utilities.createCss(this.file, this.call);
    var mixinCss = utilities.createCss(this.file, wrapStandaloneMixin(mixin));
    var message = "Could not find the output from " + mixin + " in mixin.";
    assert(css.indexOf(mixinCss) > -1, message);
  },

  doesNotCall: function(mixin) {
    var css = utilities.createCss(this.file, this.call);
    var mixinCss = utilities.createCss(this.file, wrapStandaloneMixin(mixin));
    var message = "Mixin called " + mixin + ".";
    assert(css.indexOf(mixinCss) === -1, message);
  }
};

module.exports = StandaloneMixin;
