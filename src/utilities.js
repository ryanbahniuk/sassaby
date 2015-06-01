'use strict';

var sass = require('node-sass');
var cssmin = require('cssmin');
var css = require('css');

var Utilities = {
  compileFromString: function(string) {
    var s = sass.renderSync({data: string});
    return s.css.toString();
  },

  compileWithFile: function(file, string) {
    var stringWithImport = file + string;
    return this.compileFromString(stringWithImport);
  },

  createCss: function(file, call) {
    return cssmin(this.compileWithFile(file, call));
  },

  createAst: function(file, call) {
    return css.parse(this.createCss(file, call));
  },

  scrubQuotes: function(string) {
    return string.replace(/["']/g, "");
  }
};

module.exports = Utilities;
