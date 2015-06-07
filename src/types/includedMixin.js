'use strict';

var Result = require('../result');

function IncludedMixin(variables, dependencies, file, call) {
  this.type = 'included';
  this.file = variables + dependencies + file;
  this.call = call;
}

IncludedMixin.prototype = {
  calledWith: function() {
    var args = Array.prototype.slice.call(arguments);
    return new Result(this.type, this.file, this.call, args);
  }
};

module.exports = IncludedMixin;
