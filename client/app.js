angular.module('app', [
	'ngRoute',
	'ngResource',
	'app.controllers',
	'app.directives',
	'app.services',
	'app.filters'
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});	$routeProvider.otherwise({redirectTo: '/view1'});
}]);