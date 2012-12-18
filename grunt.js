/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		meta: {
			version: '0.1',
			banner: '/*! Knockout App - v<%= meta.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* https://github.com/paglias/KnockoutApp\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
				'Matteo Pagliazzi; Licensed MIT */'
		},

		concat: {
			build: {
				src: ['<banner:meta.banner>', 'src/start.js', 'src/utils.js', 'src/model.js', 'src/collection.js', 'src/sync.js', 'src/end.js'],
				dest: 'knockout.app.js'
			},
		},

  	min: {
    	build: {
      	src: ['knockout.app.js'],
      	dest: 'knockout.app.min.js'
    	}
    },

    docco: {
    	build: {
    		src: 'knockout.app.js',
    		options: {
    			output: 'annotated-source-code'
    		}
    	}
    },

		server: {
			port: 8000,
			base: '.'
		},

		watch:{
			files: ['**/*'],
			tasks: 'build'
		}

	});

	// Load tasks
	grunt.loadNpmTasks('grunt-docco');

	// Default task.
	grunt.registerTask('build', 'concat min docco');
	grunt.registerTask("run", "build server watch");

};
