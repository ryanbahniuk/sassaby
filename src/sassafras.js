'use strict';

var assert = require("assert");
var sass = require('node-sass');
var fs = require('fs');
var css = require('css');

function compileFromString(string, callback) {
  var s = sass.renderSync({data: string}, callback);
  return s.css.toString();
}

function compileWithFile(file, string, callback) {
  var mixins = fs.readFileSync(file).toString();
  var stringWithImport = mixins + "\n\n" + string;
  return compileFromString(stringWithImport, callback);
}

function checkError(err, data) {
  if (err) { throw err; }
}

function countDeclarations(ast) {
  return ast.stylesheet.rules[0].declarations.length;
}

var Sassafras = {
  file: null,

  setFile: function(file) {
    this.file = file;
  },

  nDeclarations: function(mixin, num) {
    var compiled = compileWithFile(this.file, mixin);
    var ast = css.parse(compiled);
    assert(num === countDeclarations(ast));
  }
};

module.exports = Sassafras;
