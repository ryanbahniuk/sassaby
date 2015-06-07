'use strict';

var Result = require('../result');

function StandaloneMixin(variables, dependencies, file, call) {
  this.type = 'standalone';
  this.file = variables + dependencies + file;
  this.call = call;
}

StandaloneMixin.prototype = {
  calledWith: function() {
    var args = Array.prototype.slice.call(arguments);
    return new Result(this.type, this.file, this.call, args);
  }
};

module.exports = StandaloneMixin;
