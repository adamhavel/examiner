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

modernizr: {
   default: {
      'devFile': 'public/lib/modernizr/modernizr.js',
      'outputFile': 'public/lib/modernizr/modernizr.custom.js',
      'extra': {
         'shiv': false
      },
      'uglify': false,
      'files': {
         'src': [
            'client/**/*.js',
            'public/css/default.min.css'
         ]
      },
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
         // load angular first
         'public/lib/angular/**/*.min.js',
         // load angular production modules, i.e. not mocks
         'public/lib/angular-*/**/*.min.js',
         'public/lib/modernizr/modernizr.custom.js'
      ],
      dest: 'public/lib/libs.min.js'
   },
   ondemand: {
      src: [
         'public/lib/fastclick/lib/fastclick.js'
      ],
      dest: 'public/js/ondemand/app.touch.min.js'
   },
   shims: {
      src: [
         'public/lib/html5shiv/dist/html5shiv.js',
         'public/lib/polyfills/polyfill.js'
      ],
      dest: 'public/js/shims.min.js'
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

cmq: {
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

uncss: {
   options: {
      ignore: [/\.j-/, /:checked/, /:not/, /\.error/],
      stylesheets: ['css/default.css']
   },
   default: {
      files: {
         'public/css/default.css': ['public/**/*.html']
      }
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
               '!public/img/icon/**',
               '!public/css/*.scss',
               '!public/css/default.css'
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

hashres: {
   options: {
      fileNameFormat: '${name}.${hash}.${ext}',
   },
   build: {
      src: [
         'build/public/js/app.min.js',
         'build/public/css/default.min.css'
      ],
      dest: 'build/public/**/*.html'
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
   options: {
      plugins: [
         { removeXMLProcInst: false }
      ]
   },
   build: {
      files: [{
         expand: true,
         src: 'build/public/img/*.svg'
      }]
   },
   icons: {
      files: [{
         expand: true,
         cwd: 'public/img/icon',
         src: '*.svg',
         dest: 'temp'
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
         datasvgcss: '_icons-data.scss',
         cssprefix: 'icon--',
         pngfolder: 'bmp',
         defaultWidth: 24,
         defaultHeight: 24,
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
      files: ['public/css/**/*.scss'],
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
   images: {
      files: ['public/assets/site/img/*.(png|jpg|gif|svg)'],
      options: {
         livereload: true,
         spawn: false
      }
   },
   icons: {
      files: ['public/img/icon/*.svg'],
      tasks: ['makeicons']
   }
},

nodemon: {
   dev: {
      script: 'server.js',
      options: {
         delayTime: 1,
         cwd: 'server'
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
grunt.loadNpmTasks('grunt-combine-media-queries');
grunt.loadNpmTasks('grunt-modernizr');
grunt.loadNpmTasks('grunt-uncss');
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

grunt.registerTask('makecss', function(option) {
   grunt.task.run('exec:sass');
   if (option === 'build') {
      grunt.task.run('uncss');
   }
   grunt.task.run([
      /*'remfallback',*/ 'autoprefixer', 'cmq', 'cssmin', 'csslint'
   ]);
});

grunt.registerTask('makejs', [
   'uglify:app', 'concat:bundle', 'jshint:client'
]);

grunt.registerTask('makeicons', function() {
   if (grunt.file.expand('public/img/icon/*.svg').length > 0) {
      grunt.task.run([
         'svgmin:icons', 'grunticon:icons', 'copy:icons', 'clean:temp'
      ]);
   } else {
      grunt.log.writeln('No icons found.');
   }
});

grunt.registerTask('test', [
   'mochaTest', 'karma'
]);

grunt.registerTask('init', function(option) {
   if (option === 'build') {
      grunt.task.run('makecss:build');
   } else {
      grunt.task.run('makecss');
   }
   grunt.task.run([
      'modernizr', 'uglify:libs', 'uglify:shims', 'uglify:ondemand', 'makejs', 'jshint:server', 'makeicons'
   ]);
});


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
   'init:build', 'test', 'clean:build', 'copy:build', 'hashres:build', 'svgmin:build', 'imagemin', 'exec:build'
]);

};