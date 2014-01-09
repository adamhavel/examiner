var app = angular.module('app', [
   'ngRoute',
   'ngResource',
   'app.modules',
   'app.directives',
   'app.filters'
]);

app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.when('/view', {
      templateUrl: 'templates/template.html'
   });
   $routeProvider.otherwise({
      redirectTo: '/view'
   });
}]);