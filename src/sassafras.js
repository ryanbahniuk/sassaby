'use strict';

var fs = require('fs');
var IncludedMixin = require('./types/includedMixin');
var StandaloneMixin = require('./types/standaloneMixin');
var Func = require('./types/func');

var Sassafras = {
  path: null,
  file: null,
  variables: '',

  setFile: function(path) {
    this.path = path;
    this.file = fs.readFileSync(this.path).toString();
  },

  setVariables: function(varz) {
    var sassVariables = "";
    for (var variableName in varz) {
      sassVariables = sassVariables + '$' + variableName + ':' + varz[variableName] + ';';
    }
    this.variables = sassVariables;
  },

  assert: {
    includedMixin: function(call) {
      return new IncludedMixin(Sassafras.variables, Sassafras.file, call);
    },

    standaloneMixin: function(call) {
      return new StandaloneMixin(Sassafras.variables, Sassafras.file, call);
    },

    func: function(call) {
      return new Func(Sassafras.variables, Sassafras.file, call);
    }
  }
};

module.exports = Sassafras;
