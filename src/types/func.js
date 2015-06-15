'use strict';

var util = require('util');
var FuncResult = require('../funcResult');

function Func(variables, dependencies, file, call) {
  this.file = variables + dependencies + file;
  this.call = call;
}

Func.prototype = {
  called: function() {
    return new FuncResult(this.file, this.call);
  },

  calledWith: util.deprecate(function() {
    var args = Array.prototype.slice.call(arguments);
    return new FuncResult(this.file, this.call, args);
  }, 'Deprecation Warning: calledWith. Use calledWithArgs instead.'),

  calledWithArgs: function() {
    var args = Array.prototype.slice.call(arguments);
    return new FuncResult(this.file, this.call, args);
  }
};

module.exports = Func;
