'use strict';

var MixinResult = require('../mixinResult');

function Mixin(type, variables, dependencies, file, call) {
  this.type = type;
  this.file = variables + dependencies + file;
  this.call = call;
}

Mixin.prototype = {
  calledWith: function() {
    var args = Array.prototype.slice.call(arguments);
    return new MixinResult(this.type, this.file, this.call, args);
  }
};

module.exports = Mixin;
