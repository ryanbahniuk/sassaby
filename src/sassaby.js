'use strict';

var fs = require('fs');
var Mixin = require('./types/mixin');
var Func = require('./types/func');

var Sassaby = {
  path: null,
  file: null,
  variables: '',
  dependencies: '',

  setFile: function(path) {
    this.path = path;
    this.file = fs.readFileSync(this.path).toString();
  },

  setVariables: function(varz) {
    var sassVariables = '';
    for (var variableName in varz) {
      sassVariables = sassVariables + '$' + variableName + ':' + varz[variableName] + ';';
    }
    this.variables = sassVariables;
  },

  setDependencies: function(dependencies) {
    var sassImports = '';
    dependencies.forEach(function(fileName) {
      sassImports = sassImports + "@import '" + fileName + "';";
    });
    this.dependencies = sassImports;
  },

  assert: {
    includedMixin: function(call) {
      return new Mixin('included', Sassaby.variables, Sassaby.dependencies, Sassaby.file, call);
    },

    standaloneMixin: function(call) {
      return new Mixin('standalone', Sassaby.variables, Sassaby.dependencies, Sassaby.file, call);
    },

    func: function(call) {
      return new Func(Sassaby.variables, Sassaby.dependencies, Sassaby.file, call);
    }
  }
};

module.exports = Sassaby;
