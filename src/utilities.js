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

  createAst: function(cssString) {
    return css.parse(cssString);
  },

  scrubQuotes: function(string) {
    return string.replace(/["']/g, "");
  },

  concatArgs: function(args) {
    var argString = '';
    args.forEach(function(arg) {
      argString += arg + ', ';
    });
    return argString.substring(0, argString.length - 2);
  }
};

module.exports = Utilities;
