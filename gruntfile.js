module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			validate: {
				files: ['gruntfile.js','client/**/*.js','server/**/*.js'],
				tasks: ['jshint']
			},
			js: {
				files: ['client/**/*.js'],
				tasks: ['uglify:client'],
				options: { livereload: true }
			},
			css: {
				files: ['public/css/default.min.css'],
				tasks: ['csslint:strict'],
				options: { livereload: true }
			},
			html: {
				files: ['public/**/*.html'],
				options: { livereload: true }
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
			client: {
				src: ['client/**/*.js'],
				dest: 'public/js/app.min.js'
			}
		},

		csslint: {
			strict: {
				options: {},
				src: ['public/css/default.min.css']
			},
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

		karma: {
			options: {
				configFile: 'test/client/config/karma.conf.js',
			},
			single: {
				singleRun: true
			}
		},

		mochaTest: {
			options: {
				reporter: 'spec',
				globals: 'assert,expect,should'
			},
			single: {
				src: ['test/server/*.js']
			}
		},

		concurrent: {
			dev: ['nodemon:dev', 'watch', 'exec:sass','exec:mongo'],
			options: {
				logConcurrentOutput: true
			}
		}

	});

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-csslint');
grunt.loadNpmTasks('grunt-nodemon');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-karma');
grunt.loadNpmTasks('grunt-mocha-test');

grunt.option('force', true);

grunt.registerTask('default', ['concurrent:dev']);
grunt.registerTask('test', ['mochaTest', 'karma']);

};