module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			js: {
				files: ['gruntfile.js','client/**/*.js','server/**/*.js'],
				tasks: ['jshint']
			},
			uglify: {
				files: ['client/**/*.js'],
				tasks: ['uglify'],
				options: {
					livereload: true
				}
			},
			css: {
				files: ['public/css/**/*.css'],
				options: {
					livereload: true
				}
			},
			html: {
				files: ['public/**/*.html'],
				options: {
					livereload: true
				},
			},
		},

		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					watchedExtensions: ['js'],
					delayTime: 1,
					cwd: 'server',
					env: {
						PORT: 3000
					}
				}
			}
		},

		jshint: {
			all: ['gruntfile.js','client/**/*.js','server/**/*.js']
		},

		uglify: {
			app: {
				src: ['client/**/*.js'],
				dest: 'public/js/app.min.js'
			}
		},

		exec: {
			sass: {
				cmd: 'sass --watch default.scss:default.min.css --style compressed',
				cwd: 'public/css'
			},
			mongo: {
				cmd: 'mongod --config mongodb.conf',
			}
		},

		concurrent: {
			tasks: ['nodemon:dev', 'watch', 'exec:sass','exec:mongo'],
			options: {
				logConcurrentOutput: true
			}
		}

	});

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-nodemon');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-exec');

grunt.option('force', true);

grunt.registerTask('default', ['concurrent']);

};