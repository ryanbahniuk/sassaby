'use strict';

var FuncResult = require('../funcResult');

function Func(variables, dependencies, file, call) {
  this.file = variables + dependencies + file;
  this.call = call;
}

Func.prototype = {
  calledWith: function() {
    var args = Array.prototype.slice.call(arguments);
    return new FuncResult(this.file, this.call, args);
  }
};

module.exports = Func;
