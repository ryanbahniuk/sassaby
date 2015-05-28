'use strict';

var assert = require("assert");
var utilities = require('./utilities');

function wrapFunction(call) {
  return ".test{content:" + call + "}";
}

function Fnction(file, call) {
  this.file = file;
  this.call = wrapFunction(call);
}

Fnction.prototype = {
  equals: function(result) {
    var css = utilities.createCss(this.file, this.call);
    assert.equal(css, wrapFunction(result));
  }
};

module.exports = Fnction;
