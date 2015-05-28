'use strict';

var fs = require('fs');
var IncludedMixin = require('./types/includedMixin');
var StandaloneMixin = require('./types/standaloneMixin');
var Fnction = require('./types/fnction');

var Sassafras = {
  file: null,

  setFile: function(filename) {
    this.filename = filename;
    this.file = fs.readFileSync(filename).toString();
  },

  includedMixin: function(call) {
    return new IncludedMixin(Sassafras.file, call);
  },

  standaloneMixin: function(call) {
    return new StandaloneMixin(Sassafras.file, call);
  },

  fnction: function(call) {
    return new Fnction(Sassafras.file, call);
  }
};

module.exports = Sassafras;
