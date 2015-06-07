'use strict';

var MixinResult = require('../mixinResult');

function IncludedMixin(variables, dependencies, file, call) {
  this.type = 'included';
  this.file = variables + dependencies + file;
  this.call = call;
}

IncludedMixin.prototype = {
  calledWith: function() {
    var args = Array.prototype.slice.call(arguments);
    return new MixinResult(this.type, this.file, this.call, args);
  }
};

module.exports = IncludedMixin;
