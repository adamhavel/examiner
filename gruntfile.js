module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			lint: {
				files: ['gruntfile.js','client/**/*.js','server/**/*.js'],
				tasks: ['jshint']
			},
			js: {
				files: ['client/**/*.js'],
				tasks: ['uglify:app','concat:angular'],
				options: { livereload: true }
			},
			css: {
				files: ['public/css/*.scss'],
				tasks: ['exec:sass','autoprefixer','csslint','cssmin'],
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
			options: {
				force: true
			},
			all: [
				'gruntfile.js',
				'client/**/*.js',
				'server/**/*.js'
			]
		},

		concat: {
			options: {
				separator: ';',
				stripBanners: true
			},
			angular: {
				src: [
					// load angular first
					'public/lib/angular/**/*.min.js',
					// load angular production modules, i.e. not mocks
					'public/lib/angular-*/**/*.min.js',
					'public/js/**/*.min.js'
				],
				dest: 'public/js/app.min.js',
			},
		},

		uglify: {
			app: {
				src: [
					'client/**/*.js'
				],
				dest: 'public/js/app.min.js'
			},
			shiv: {
				src: ['public/lib/**/html5shiv.js'],
				dest: 'public/js/html5shiv.min.js'	
			}
		},

		autoprefixer: {
			default: {
				options: {
					browsers: ['> 1%','last 2 versions','firefox 24','opera 12.1']
				},
				src: 'public/css/default.css'
			}
		},

		csslint: {
			options: {
				csslintrc: '.csslintrc'

			},
			default: {
				src: ['public/css/default.css']
			}
		},

		cssmin: {
			options: {
				report: 'min',
				keepSpecialComments: 0
			},
			default: {
				files: {
					'public/css/default.min.css': ['public/css/default.css']
				}
			}
		},

		hashres: {
			options: {
				fileNameFormat: '${name}.${hash}.${ext}',
			},
			build: {
				src: [
					'build/public/js/app.min.js',
					'build/public/css/default.min.css'
				],
				dest: 'build/public/index.html'
			}
		},

		exec: {
			sass: {
				cmd: 'sass default.scss:default.css --style expanded',
				cwd: 'public/css'
			},
			mongo: {
				cmd: 'mongod --config db/mongodb.conf',
			},
			update: {
				cmd: 'npm update'
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
			dev: ['exec:mongo','nodemon:dev','watch'],
			options: {
				logConcurrentOutput: true
			}
		},

		clean: {
			build: ['build']
		},

		copy: {
			build: {
				files: [
					{
						expand: true,
						src: ['server/**'],
						dest: 'build/'
					},
					{
						expand: true,
						src: [
							'public/**',
							'!public/lib/**',
							'!public/css/*.scss'
						],
						dest: 'build/'
					},
				]
			}
		},

		bump: {
			options: {
				files: ['package.json','bower.json'],
				commitFiles: ['-a'],
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-hashres');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('default', function() {
		grunt.option('force', true);
		grunt.task.run(['concurrent:dev']);
	});

	grunt.registerTask('test', [
		'mochaTest',
		'karma'
	]);

	grunt.option('force', true);

	grunt.registerTask('build', [
		'exec:sass',
		'autoprefixer',
		'csslint',
		'cssmin',
		'jshint',
		'mochaTest',
		'karma',
		'uglify:app',
		'concat:angular',
		'uglify:shiv',
		'clean:build',
		'copy:build',
		'hashres:build',
		'bump:build'
	]);

};