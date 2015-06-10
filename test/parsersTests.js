'use strict';

var assert = require('assert');
var sinon = require('sinon');
var parsers = require('../src/parsers');
var ast = require('./fixtures/ast.json');
var astNoSelectors = require('./fixtures/astNoSelectors.json');

describe('Parsers', function() {
  describe('countDeclarations', function() {
    it('should return the number of declarations in the first ruleset', function() {
      assert.equal(parsers.countDeclarations(ast), 1);
    });

    it('should return 0 if stylesheet does not exist', function() {
      assert.equal(parsers.countDeclarations({}), 0);
    });

    it('should return 0 if stylesheet.rules does not exist', function() {
      assert.equal(parsers.countDeclarations({stylesheet: {}}), 0);
    });

    it('should return 0 if stylesheet.rules[0].declarations does not exist', function() {
      assert.equal(parsers.countDeclarations({stylesheet: {rules: [{}]}}), 0);
    });
  });

  describe('findDeclaration', function() {
    it('should return the declaration object if the property is found', function() {
      var declaration = {
        'type': 'declaration',
        'property': 'background-color',
        'value': 'blue',
        'position': {
          'start': {
            'line': 7,
            'column': 3
          },
          'end': {
            'line': 7,
            'column': 25
          }
        }
      };
      assert.deepEqual(parsers.findDeclaration(ast, 'background-color'), declaration);
    });

    it('should return the first declaration object if two of the property are found', function() {
      var declaration = {
        'type': 'declaration',
        'property': 'color',
        'value': 'red',
        'position': {
          'start': {
            'line': 2,
            'column': 3
          },
          'end': {
            'line': 2,
            'column': 13
          }
        }
      };
      assert.deepEqual(parsers.findDeclaration(ast, 'color'), declaration);
    });

    it('should return undefined if the declaration is not found', function() {
      assert.equal(parsers.findDeclaration(ast, 'display'), undefined);
    });
  });

  describe('hasSelector', function() {
    it('should return true if the selector is defined by itself', function() {
      assert(parsers.hasSelector(ast, '.test'));
    });

    it('should return true if the selector is defined in a list', function() {
      assert(parsers.hasSelector(ast, '.hello'));
      assert(parsers.hasSelector(ast, '.blah'));
    });

    it('should return false if the selector not defined', function() {
      assert(!parsers.hasSelector(ast, '.not-defined'));
    });

    it('should return false if no stylesheet is defined', function() {
      assert(!parsers.hasSelector(astNoSelectors, '.test'));
    });

    it('should return false if no rules are defined', function() {
      assert(!parsers.hasSelector(astNoSelectors, '.test'));
    });
  });

  describe('hasFontFace', function() {
    it('should return true if font-face is defined', function() {
      assert(parsers.hasFontFace(astNoSelectors));
    });

    it('should return false if font-face not defined', function() {
      assert(!parsers.hasFontFace(ast));
    });
  });

  describe('hasImport', function() {
    var name = 'test';

    context('should return true if the import exists', function() {
      it('if it uses single quotes', function() {
        var sass = "@import '" + name + "';";
        assert(parsers.hasImport(sass, name));
      });

      it('if it uses double quotes', function() {
        var sass = '@import "' + name + '";';
        assert(parsers.hasImport(sass, name));
      });

      it('if it has no space', function() {
        var sass = '@import"' + name + '";';
        assert(parsers.hasImport(sass, name));
      });

      it('if it has multiple on the same line', function() {
        var sass = '@import "hello"; @import"' + name + '";';
        assert(parsers.hasImport(sass, name));
      });

      it('if it has multiple on different lines', function() {
        var sass = '@import "hello";\n@import"' + name + '";';
        assert(parsers.hasImport(sass, name));
      });

      it('if it has multiple in a comma separated list', function() {
        var sass = '@import "hello", "' + name + '";';
        assert(parsers.hasImport(sass, name));
      });
    });

    context('should return false if the import does not exist', function() {
      var alternate = 'nope';

      it('if it uses single quotes', function() {
        var sass = "@import '" + alternate + "';";
        assert(!parsers.hasImport(sass, name));
      });

      it('if it uses double quotes', function() {
        var sass = '@import "' + alternate + '";';
        assert(!parsers.hasImport(sass, name));
      });

      it('if it has no space', function() {
        var sass = '@import"' + alternate + '";';
        assert(!parsers.hasImport(sass, name));
      });

      it('if it has multiple on the same line', function() {
        var sass = '@import "hello"; @import"' + alternate + '";';
        assert(!parsers.hasImport(sass, name));
      });

      it('if it has multiple on different lines', function() {
        var sass = '@import "hello";\n@import"' + alternate + '";';
        assert(!parsers.hasImport(sass, name));
      });

      it('if it has multiple in a comma separated list', function() {
        var sass = '@import "hello", "' + alternate + '";';
        assert(!parsers.hasImport(sass, name));
      });
    });
  });
});
