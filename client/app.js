var ng = angular.module('app', [
   'ngRoute',
   'ngResource',
   'app.modules',
   'app.directives',
   'app.filters'
]);

ng.config(['$routeProvider', function($routeProvider) {
   $routeProvider.when('/view', {
      templateUrl: 'templates/template.html'
   });
   $routeProvider.otherwise({
      redirectTo: '/view'
   });
}]);