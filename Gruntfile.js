module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		// concat: {
		// 	css: {
		// 		src: [
		// 			'css_build/*'
		// 		],
		// 		dest: 'build/css/all.css'
		// 	}
		// },

		// cssmin: {
		// 	css: {
		// 		src: 'build/css/all.css',
		// 		dest: 'css/all.min.css'
		// 	}
		// },

		react: {
			single_file_output: {
				files: {
					'js/build/app.js': 'js/app.js'
				}
			}
			// combined_file_output: {
			// 	files: {
			// 		'path/to/output/dir/combined.js': [
			// 			'path/to/jsx/templates/dir/input1.jsx',
			// 			'path/to/jsx/templates/dir/input2.jsx'
			// 		]
			// 	}
			// },
			// dynamic_mappings: {
			// 	files: [{
			// 		expand: true,
			// 		cwd: 'path/to/jsx/templates/dir',
			// 		src: ['**/*.jsx'],
			// 		dest: 'path/to/output/dir',
			// 		ext: '.js'
			// 	}]
			// }
		},

		watch: {
			options: { //35729
				livereload: true,
			},
			css: {
				files: ['css/*.css']
			},
			html: {
				files: ['*.html']
			},
			js: {
				files: ['js/*.js'],
				tasks: ['react']
			}
		},

		connect: {
			'static': {
				options: {
					hostname: 'localhost',
					port: 8001
					// base: 'www-root'
				}
			}
		}

	});

	// grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-react');

	grunt.registerTask('default', ['concat', 'cssmin', 'browserify', 'uglify']);
	grunt.registerTask('server', ['connect:static', 'watch']);

	// define an alias for common tasks
	// grunt.registerTask('myTasks', ['task1', 'task2:target', 'task3']);		

};