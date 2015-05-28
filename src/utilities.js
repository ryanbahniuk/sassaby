'use strict';

var sass = require('node-sass');
var cssmin = require('cssmin');
var css = require('css');

function checkError(err, data) {
  if (err) { throw err; }
}

var Utilities = {
  compileFromString: function(string, callback) {
    var s = sass.renderSync({data: string}, callback);
    return s.css.toString();
  },

  compileWithFile: function(file, string, callback) {
    var stringWithImport = file + string;
    return this.compileFromString(stringWithImport, callback);
  },

  createCss: function(file, call) {
    return cssmin(this.compileWithFile(file, call));
  },

  createAst: function(file, call) {
    return css.parse(this.createCss(file, call));
  }
};

module.exports = Utilities;
