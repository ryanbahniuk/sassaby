'use strict';

var util = require('util');
var MixinResult = require('../mixinResult');

function Mixin(type, variables, dependencies, file, call) {
  this.type = type;
  this.file = variables + dependencies + file;
  this.call = call;
}

Mixin.prototype = {
  calledWith: util.deprecate(function() {
    var args = Array.prototype.slice.call(arguments);
    return new MixinResult(this.type, this.file, this.call, args);
  }, 'Deprecation Warning: calledWith. Use calledWithArgs instead.'),

  calledWithArgs: function() {
    var args = Array.prototype.slice.call(arguments);
    return new MixinResult(this.type, this.file, this.call, args);
  }
};

module.exports = Mixin;
