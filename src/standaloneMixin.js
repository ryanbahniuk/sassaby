'use strict';

var assert = require("assert");
var utilities = require('./utilities');
var parsers = require('./parsers');

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
    assert(parsers.hasSelector(ast, selector));
  }
};

module.exports = StandaloneMixin;
