'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      test: {
        files: {
          'results/results.css': 'src/sample.scss'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', []);
};
