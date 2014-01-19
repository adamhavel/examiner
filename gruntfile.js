module.exports = function(grunt) { grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),

/* ==========================================================================
   Variables
   ========================================================================== */



/* ==========================================================================
   Configuration
   ========================================================================== */

/* JavaScript
   ========================================================================== */
   
jshint: {
   options: {
      jshintrc: 'grunt/.jshintrc',
      force: true
   },
   client: 'client/**/*.js',
   server: 'server/**/*.js'
},

concat: {
   options: {
      separator: ';'
   },
   bundle: {
      src: [
         'public/lib/libs.min.js',
         'public/js/app.min.js'
      ],
      dest: 'public/js/app.min.js',
   }
},

uglify: {
   app: {
      options: {
         report: 'min'
      },
      src: 'client/**/*.js',
      dest: 'public/js/app.min.js'
   },
   libs: {
      options: {
         mangle: false
      }, 
      src: [
         'public/lib/underscore/underscore-min.js',
         // load angular first
         'public/lib/angular/**/*.min.js',
         // load angular production modules, i.e. not mocks
         'public/lib/angular-*/**/*.min.js'
      ],
      dest: 'public/lib/libs.min.js'
   },
   shiv: {
      src: 'public/lib/**/html5shiv.js',
      dest: 'public/js/html5shiv.min.js'  
   }
},


/* Stylesheet
   ========================================================================== */
   
sass: {
   default: {
      src: 'public/css/default.scss',
      dest: 'public/css/default.css'
   }
},

autoprefixer: {
   default: {
      options: {
         browsers: ['> 1%', 'last 2 versions', 'firefox 24', 'opera 12.1']
      },
      src: 'public/css/default.css'
   }
},

remfallback: {
   default: {
      files: {
         'public/css/default.css': ['public/css/default.css']
      }
   }
},

csslint: {
   options: {
      csslintrc: 'grunt/.csslintrc'
   },
   default: {
      src: 'public/css/default.css'
   }
},

cssmin: {
   options: {
      report: 'min',
      keepSpecialComments: 0
   },
   default: {
      src: 'public/css/default.css',
      dest: 'public/css/default.min.css'
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


/* Tests
   ========================================================================== */
   
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


/* Build
   ========================================================================== */
   
clean: {
   build: ['build'],
   temp: ['temp']
},

copy: {
   build: {
      files: [
         {
            src: 'package.json',
            dest: 'build/'
         },
         {
            expand: true,
            src: 'server/**',
            dest: 'build/'
         },
         {
            expand: true,
            src: [
               'public/**',
               '!public/lib/**',
               '!public/temp/**',
               '!public/img/icon-*.svg',
               '!public/css/*.scss'
            ],
            dest: 'build/'
         },
      ]
   },
   icons: {
      files: [
         {
            expand: true,
            cwd: 'temp/bmp',
            src: '*.png',
            dest: 'public/img',
            rename: function (dest, src) {
               return dest + '/icon-' + src;
            }
         },
         {
            expand: true,
            cwd: 'temp',
            src: '*.scss',
            dest: 'public/css'
         }
      ]   
   }
},

bump: {
   options: {
      files: ['package.json', 'bower.json'],
      commit: false,
      push: false
   }
},

/* Images
   ========================================================================== */
   
svgmin: { 
   build: {
      files: [{
         expand: true,
         src: 'build/public/img/*.svg'
      }]
   },
   icons: {
      files: [{
         expand: true,
         cwd: 'public/img',
         src: 'icon-*.svg',
         dest: 'temp',
         rename: function (dest, src) {
            return dest + '/' + src.replace(/^icon-/, '');
         }
      }]
   }
},

imagemin: {
   png: {
      options: {
         optimizationLevel: 7
      },
      files: [{
         expand: true,
         src: 'build/public/img/*.png'
      }]
   },
   jpg: {
      options: {
         progressive: true
      },
      files: [{
         expand: true,
         src: 'build/public/img/*.jpg'
      }]
   }
},

grunticon: {
   icons: {
      files: [{
         expand: true,
         cwd: 'temp',
         src: ['*.svg'],
         dest: 'temp'
      }],
      options: {
         datasvgcss: '_icons.scss',
         cssprefix: '.icon--',
         pngfolder: 'bmp',
         defaultWidth: 20,
         defaultHeight: 20,
         template: 'grunt/icon.hbs'
      }
   }
},


/* Runtime
   ========================================================================== */
   
watch: {
   options: {
      spawn: true
   },
   server: {
      files: ['server/**/*.js'],
      tasks: ['jshint:server']
   },
   js: {
      files: ['client/**/*.js'],
      tasks: ['makejs'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   css: {
      files: ['public/css/*.scss'],
      tasks: ['makecss'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   html: {
      files: ['public/index.html', 'public/templates/*.html'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   icons: {
      files: ['public/img/icon-*.svg'],
      tasks: ['makeicons']
   }
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
   },
   build: {
      cmd: 'npm install --production',
      cwd: 'build'
   }
},

concurrent: {
   dev: ['exec:mongo', 'nodemon:dev', 'watch'],
   options: {
      logConcurrentOutput: true
   }
}

});


/* ==========================================================================
   Tasks
   ========================================================================== */

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-csslint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-nodemon');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-remfallback');
grunt.loadNpmTasks('grunt-hashres');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-svgmin');
grunt.loadNpmTasks('grunt-grunticon');
grunt.loadNpmTasks('grunt-karma');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-bump');

/* Helper tasks
   ========================================================================== */
   
grunt.registerTask('makecss', [
   'sass', 'remfallback', 'autoprefixer', 'cssmin', 'csslint'
]);

grunt.registerTask('makejs', [
   'uglify:app', 'concat:bundle', 'jshint:client'
]);

grunt.registerTask('makeicons', [
   'svgmin:icons', 'grunticon:icons', 'copy:icons', 'clean:temp'
]);

grunt.registerTask('test', [
   'mochaTest', 'karma'
]);

grunt.registerTask('init', [
   'makecss', 'uglify:libs', 'uglify:shiv', 'makejs', 'jshint:server', 'makeicons'
]);


/* Main tasks
   ========================================================================== */
   
grunt.registerTask('default', function() {
   grunt.option('force', true);
   grunt.task.run([
      'init', 'concurrent:dev'
   ]);
});

grunt.option('force', true);
grunt.registerTask('build', [
   'init', 'test', 'clean:build', 'copy:build', 'hashres:build', 'svgmin:build', 'imagemin', 'exec:build'
]);

};