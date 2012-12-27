/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! Knockout App - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* https://github.com/paglias/KnockoutApp\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'Matteo Pagliazzi; Licensed MIT */\n\n',

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: ['src/start.js', 'src/utils.js', 'src/model.js', 'src/collection.js', 'src/sync.js', 'src/end.js'],
        dest: 'knockout.app.js'
      },
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        files:{
          'knockout.app.min.js': ['knockout.app.js']
        } 
      }
    },

    connect: {
      server: { },
    },

    watch: {
      build: {
        files: ['src/**/*', 'package.json', 'tests/**/*'],
        tasks: ['build', 'qunit']
      }
    },

    qunit: {
      all: 'http://localhost:8000/tests/index.html'
    }

    /*docco: {
      build: {
        src: 'knockout.app.js',
        options: {
          output: 'annotated-source-code'
        }
      }
    },*/

  });

  // Load tasks
  //grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Register tasks.
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('run', ['build', 'connect:server', 'qunit', 'watch']);

};
