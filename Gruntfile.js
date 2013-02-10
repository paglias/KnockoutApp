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
        banner: '<%= banner %>',
        process: true
      },
      build: {
        src: ['src/start.js', 'src/utils.js', 'src/model.js', 'src/collection.js', 'src/sync.js', 'src/end.js'],
        dest: 'build/knockout.app.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        files: {
          'build/knockout.app.min.js': ['build/knockout.app.js']
        }
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:8000/tests/index.html'
          ]
        }
      }
    },

    connect: {
      server: {} // keep the server running using 'grunt connect:server:keepalive'
    },

    watch: {
      build: {
        files: ['src/**/*', 'package.json', 'tests/**/*'],
        tasks: ['build', 'qunit']
      }
    },

    copy: {
      publish: {
        files: [
          {src: ['tests/**', 'example/**', 'build/**'], dest: '_site/'}
        ]
      }
    },

    docco: {
      publish: {
        src: ['build/knockout.app.js', 'example/app.js'],
        dest: '_site/annotated-source-code/'
      }
    },

    exec:{
      publish: {
        cmd: function(){
          var version = this.config.get('pkg').version,
              files = 'build/knockout.app.js build/knockout.app.min.js',
              build = 'git add -f ' + files,
              commit = 'git commit -m\'publishing v' + version + '\'',
              tag = 'git tag ' + version,
              push = 'git push origin master && git push --tags',
              publish = 'npm publish',
              back = 'git rm ' + files + ' && git commit -am\'switching back to development\' && git push origin master',
              // Site
              cdSite = 'cd _site',
              commitSite = 'git add -A && git commit -m\'publishing site for v' + version + '\' && git tag gh-pages-' + version,
              pushSite = 'git push origin gh-pages && git push --tags',
              backSite = 'cd ..',
              site = cdSite + ' && ' + commitSite + ' && ' + pushSite + ' && ' + backSite;
          return build + ' && ' + commit + ' && ' + tag + ' && ' + push + ' && ' + publish + ' && ' + back + ' && ' + site;
        }
      }
    }

  });

  // Register tasks.
  grunt.registerTask('build', ['concat:build', 'uglify:build']);
  grunt.registerTask('test', ['build', 'connect:server', 'qunit']);
  grunt.registerTask('run', ['test', 'watch']);

  grunt.registerTask('publish', ['test', 'copy:publish', 'docco:publish', 'exec:publish']); //used to publish a new version of KnockoutApp

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-exec');

};
