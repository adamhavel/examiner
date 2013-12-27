module.exports = function(config) {
	config.set({
		basePath: '../../..',
		frameworks: ['mocha', 'chai'],
		browsers: ['PhantomJS'],
		files: [
			'public/lib/angular/angular.js',
			'public/lib/angular-mocks/angular-mocks.js',
			'public/lib/angular-resource/angular-resource.js',
			'public/lib/angular-route/angular-route.js',
			'public/js/app.min.js',
			'test/client/*.js'
		],
		reporters: ['dots'],
		colors: true,
		autoWatch: false,
		singleRun: false
	});
};
